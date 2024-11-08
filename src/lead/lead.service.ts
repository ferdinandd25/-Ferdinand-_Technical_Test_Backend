import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema, Types } from 'mongoose';
import { Lead } from 'src/schemas/lead.schema';
import { UpdateLeadStatusDto } from './dtos/update-lead-status.dto';
import { CreateLeadDto } from './dtos/create-lead.dto';
import { RabbitmqProducerService } from 'src/rabbitmq-producer/rabbitmq-producer.service';
import { LeadStatusEnum } from 'src/enums/leads-status.enum';
import { UserService } from 'src/user/user.service';
import { updateLeadAssigneeDto } from './dtos/update-lead-assignee.dto';
import { LeadHistory } from 'src/schemas/lead-history.schema';

@Injectable()
export class LeadService {
  private lastAssignedSalesIndex = 0;

  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<Lead>,
    @InjectModel(LeadHistory.name)
    private readonly leadHistoryModel: Model<LeadHistory>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly rmqProducerService: RabbitmqProducerService,
    private readonly userService: UserService,
  ) {}

  async createLead(user, data: CreateLeadDto) {
    const dbSession = await this.connection.startSession();
    dbSession.startTransaction({
      readConcern: {
        level: 'snapshot',
      },
      writeConcern: {
        w: 'majority',
      },
    });

    let response = null;

    try {
      // Create lead
      const newLead = await this.leadModel.create(
        {
          customerName: data.customerName,
          email: data.email,
          status: LeadStatusEnum.NEW_LEAD,
          createdBy: new Schema.ObjectId(user._id?.toStrin()),
          status_history: [
            {
              status: LeadStatusEnum.NEW_LEAD,
              updatedBy: `${user.full_name} (${user.role})`,
              updatedAt: new Date(),
            },
          ],
        },
        { session: dbSession },
      );

      await dbSession.commitTransaction();
      response = { status: 'success', data: newLead };

      // assign salesperson on RABBITMQ
      await this.rmqProducerService.assignSalesperson(newLead);
    } catch (error) {
      await dbSession.abortTransaction();
      response = { status: 'failed', message: error?.message };
    } finally {
      await dbSession.endSession();
    }

    return response;
  }

  async updateStatus(
    user,
    leadId: string,
    updateLeadStatusDto: UpdateLeadStatusDto,
  ): Promise<Lead> {
    const dbSession = await this.connection.startSession();
    dbSession.startTransaction({
      readConcern: {
        level: 'snapshot',
      },
      writeConcern: {
        w: 'majority',
      },
    });

    let response = null;

    try {
      const { status, notes, surveyImages } = updateLeadStatusDto;
      const updateData: any = { status };
      if (notes) updateData.notes = notes;
      if (surveyImages) updateData.surveyImages = surveyImages;

      const updatedLeads = await this.leadModel.findByIdAndUpdate(
        leadId,
        {
          $set: updateData,
          $push: {
            status_history: {
              status: LeadStatusEnum.NEW_LEAD,
              updatedBy: `${user.full_name} (${user.role})`,
              updatedAt: new Date(),
            },
          },
        },
        {
          new: true,
          session: dbSession,
        },
      );

      // create new Account for client if leads status updated to DEAL
      if (updatedLeads.status === LeadStatusEnum.DEAL) {
        await this.rmqProducerService.createClientUser(updatedLeads);
      }
      await dbSession.commitTransaction();
      response = { status: 'success', data: updatedLeads };
    } catch (error) {
      await dbSession.abortTransaction();
      response = { status: 'failed', message: error?.message };
    } finally {
      await dbSession.endSession();
    }

    return response;
  }

  async updateAssignee(user, id: string, payload: updateLeadAssigneeDto) {
    const dbSession = await this.connection.startSession();
    dbSession.startTransaction({
      readConcern: {
        level: 'snapshot',
      },
      writeConcern: {
        w: 'majority',
      },
    });

    let response = null;

    try {
      const { salespersonId } = payload;
      const updatedLeads = await this.leadModel.findByIdAndUpdate(
        id,
        {
          $set: {
            assignedSalesperson: new Types.ObjectId(salespersonId),
          },
        },
        {
          new: true,
          session: dbSession,
        },
      );

      await this.insertLeadHistory(user, updatedLeads, dbSession);
      await dbSession.commitTransaction();
      response = { status: 'success', data: updatedLeads };
    } catch (error) {
      await dbSession.abortTransaction();
      response = { status: 'failed', message: error?.message };
    } finally {
      await dbSession.endSession();
    }

    return response;
  }

  private async insertLeadHistory(user, leadData, dbSession = null) {
    await this.leadHistoryModel.create(
      {
        lead: leadData._id,
        data: leadData,
        updatedBy: `${user.full_name} (${user.role})`,
      },
      {
        session: dbSession,
      },
    );
  }
}
