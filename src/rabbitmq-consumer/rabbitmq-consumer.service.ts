import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { Config } from 'src/schemas/config.schema';
import { Lead } from 'src/schemas/lead.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class RabbitmqConsumerService {
  constructor(
    @InjectModel(Lead.name)
    private readonly leadModel: Model<Lead>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Config.name)
    private readonly configModel: Model<Config>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async assignSalesperson(leadData: Lead) {
    const dbSession = await this.connection.startSession();
    dbSession.startTransaction({
      readConcern: {
        level: 'snapshot',
      },
      writeConcern: {
        w: 'majority',
      },
    });

    try {
      // Fetch eligible salespeople
      const salespeople = await this.userModel
        .find({
          role: UserRoleEnum.SALESPERSON,
          $or: [
            { status: true },
            { suspension: null },
            { 'suspension.startDate': { $gt: new Date() } },
            { 'suspension.endDate': { $lt: new Date() } },
          ],
        })
        .sort({ _id: 1 })
        .session(dbSession);

      const lastIndexConfig = await this.configModel.findOne({
        name: 'last-assignee-index',
      });
      let lastIndex = 0;
      if (lastIndexConfig) {
        lastIndex = lastIndexConfig.config['value'];
      }

      if (!salespeople || salespeople.length === 0) {
        throw new Error('No active salespeople available.');
      }

      // Round-robin assignment logic
      const salesperson = salespeople[lastIndex];
      await this.leadModel.findByIdAndUpdate(
        leadData._id,
        {
          $set: {
            assignedSalesperson: salesperson._id,
          },
        },
        {
          session: dbSession,
        },
      );

      lastIndex = (lastIndex + 1) % salespeople.length; // Move to the next index
      lastIndexConfig.config = { value: lastIndex };
      await lastIndexConfig.save({ session: dbSession });
      await dbSession.commitTransaction();
    } catch (error) {
      await dbSession.abortTransaction();
      console.error(error);
      throw new Error(error);
    } finally {
      await dbSession.endSession();
    }
  }

  async createClientUser(leadData: Lead) {
    const dbSession = await this.connection.startSession();
    dbSession.startTransaction({
      readConcern: {
        level: 'snapshot',
      },
      writeConcern: {
        w: 'majority',
      },
    });

    try {
      await this.userModel.create(
        {
          email: leadData.email,
          fullName: leadData.customerName,
          role: UserRoleEnum.CLIENT,
          password: leadData.email,
        },
        { session: dbSession },
      );
      await dbSession.commitTransaction();
    } catch (error) {
      await dbSession.abortTransaction();
      console.error(error);
      throw new Error(error);
    } finally {
      await dbSession.endSession();
    }
  }
}
