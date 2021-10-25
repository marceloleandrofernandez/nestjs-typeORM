import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}
  /*  private counterId = 1;
  private products: Product[] = [
    {
      id: 1,
      name: 'Producto 1',
      description: 'lorem lorem',
      price: 10000,
      stock: 300,
      image: 'https://i.imgur.com/U4iGx1j.jpeg',
    },
  ];
 */
  findAll() {
    return this.productRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    /* const newProduct = new Product();
    newProduct.name = data.name;
    newProduct.description = data.description;
    newProduct.price = data.price;
    newProduct.stock = data.stock;
    newProduct.image = data.image; */
    const newProduct = this.productRepo.create(data);
    return this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    try {
      const product = await this.productRepo.findOne(id);
      this.productRepo.merge(product, changes);
      return this.productRepo.save(product);
    } catch (error) {
      throw new NotFoundException(`Product #${id} not found`);
    }
  }

  async remove(id: number) {
    if (!(await this.productRepo.findOne(id))) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.productRepo.delete(id);
  }
}
