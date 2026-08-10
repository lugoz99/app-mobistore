import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DevicesService } from '../devices/devices.service';
import { User } from '../auth/entities/user.entity';
import { initialData } from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly devicesService: DevicesService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    // Delete the old data
    await this.deleteTables();

    // Create the users and get the first user
    const adminUser = await this.insertUsers();

    // Create the devices with the user
    await this.insertNewDevices(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    // Delete all devices
    await this.devicesService.deleteAllDevices();

    // Delete all users
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  private async insertUsers() {
    // Get the users from the seed data
    const seedUsers = initialData.users;

    // Create the users
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    // Save all users in the database
    const dbUsers = await this.userRepository.save(users);

    // Return the first user
    return dbUsers[0];
  }

  private async insertNewDevices(user: User) {
    // Get the devices from the seed data
    const devices = initialData.devices;

    const insertPromises = [];

    // Create each device with the user
    devices.forEach((device) => {
      insertPromises.push(this.devicesService.create(device, [], user));
    });

    // Wait until all devices are created
    await Promise.all(insertPromises);

    return true;
  }
}
