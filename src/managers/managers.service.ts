import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/types';
import { hashPassword } from 'src/common/utils/passwordHashManager';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { mapUserToInfo } from 'src/users/users.mapper';
import { MailerService } from 'src/mailer/mailer.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ManagersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createManagerDto: CreateManagerDto) {
    const { username, email, firstname, lastname } = createManagerDto;

    // Génération d'un mot de passe aléatoire de 12 caractères
    const generatedPassword = randomBytes(6).toString('hex');

    const manager = await this.usersService.create({
      username,
      email,
      passwordHash: hashPassword(generatedPassword),
      role: UserRole.MANAGER,
      active: true,
      verified: true,
      profil:
        firstname || lastname
          ? {
              firstname,
              lastname,
            }
          : undefined,
    });

    // Envoi de l'invitation par mail
    await this.mailerService.sendManagerInvitation(
      email,
      username,
      generatedPassword,
    );

    return mapUserToInfo(manager);
  }

  async findAll() {
    const managers = await this.usersService.findByRole(UserRole.MANAGER);
    return managers.map((m) => mapUserToInfo(m));
  }

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    const user = await this.usersService.getUserById(id);

    if (updateManagerDto.username) user.username = updateManagerDto.username;
    if (updateManagerDto.email) user.email = updateManagerDto.email;

    if (
      updateManagerDto.firstname !== undefined ||
      updateManagerDto.lastname !== undefined
    ) {
      if (!user.profil) {
        user.profil = {};
      }

      if (updateManagerDto.firstname !== undefined)
        user.profil.firstname = updateManagerDto.firstname;
      if (updateManagerDto.lastname !== undefined)
        user.profil.lastname = updateManagerDto.lastname;
    }

    await user.save();
    return mapUserToInfo(user);
  }
}
