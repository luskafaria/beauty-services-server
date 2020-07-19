import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class SessionsController {
  public async create(reques: Request, response: Response): Promise<Response> {
    const { email } = reques.body;

    const sendForgotPasswordService = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordService.execute({
      email,
    });

    return response.status(204).json();
  }
}
