import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    return category;
  }

  async findAll() {
    return await this.categoryRepository.find({});
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
      select: { id: true, name: true },
    });
    if (!category) throw new NotFoundException("Category Don't exists");
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    await this.categoryRepository.save(category);

    return category;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.delete(id);
    if (category.affected === 0) {
      throw new NotFoundException('Category not found!');
    }
  }
}
