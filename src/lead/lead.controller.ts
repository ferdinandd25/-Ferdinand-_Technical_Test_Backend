import {
  Controller,
  Body,
  Param,
  Post,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { UpdateLeadStatusDto } from './dtos/update-lead-status.dto';
import { CreateLeadDto } from './dtos/create-lead.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { updateLeadAssigneeDto } from './dtos/update-lead-assignee.dto';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createLead(@Req() req, @Body() data: CreateLeadDto, @Res() res) {
    const allowedRoles = [
      UserRoleEnum.SUPERADMIN,
      UserRoleEnum.CUSTOMERSERVICE,
    ];
    if (allowedRoles.indexOf(req.user?.role) === -1) {
      return res.status(HttpStatus.OK).json({
        status: 'failed',
        message: 'Akun Anda tidak diijinkan untuk membuat Leads.',
      });
    }
    return res
      .status(HttpStatus.OK)
      .json(this.leadService.createLead(req.user, data));
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  async updateLeadStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() updateLeadStatusDto: UpdateLeadStatusDto,
    @Res() res,
  ) {
    const allowedRoles = [UserRoleEnum.SUPERADMIN, UserRoleEnum.SALESPERSON];
    if (allowedRoles.indexOf(req.user?.role) === -1) {
      return res.status(HttpStatus.OK).json({
        status: 'failed',
        message: 'Akun Anda tidak diijinkan untuk membuat Leads.',
      });
    }
    return res
      .status(HttpStatus.OK)
      .json(this.leadService.updateStatus(req.user, id, updateLeadStatusDto));
  }

  @Put(':id/assignee')
  @UseGuards(AuthGuard)
  async updateLeadAssignee(
    @Req() req,
    @Param('id') id: string,
    @Body() payload: updateLeadAssigneeDto,
    @Res() res,
  ) {
    const allowedRoles = [UserRoleEnum.SUPERADMIN];
    if (allowedRoles.indexOf(req.user?.role) === -1) {
      return res.status(HttpStatus.OK).json({
        status: 'failed',
        message: 'Akun Anda tidak diijinkan untuk membuat Leads.',
      });
    }
    return res
      .status(HttpStatus.OK)
      .json(this.leadService.updateAssignee(req.user, id, payload));
  }
}
