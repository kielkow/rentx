import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.cars.find(car => car.license_plate === license_plate);
    return car;
  }

  async findAvailable(
    name?: string,
    brand?: string,
    category_id?: string,
  ): Promise<Car[]> {
    let cars = this.cars.filter(car => car.available);

    if (category_id || brand || name) {
      cars = cars.filter(
        car =>
          (name && car.name === name) ||
          (brand && car.brand === brand) ||
          (category_id && car.category_id === category_id),
      );
    }

    return cars;
  }

  async findById(id: string): Promise<Car> {
    const car = this.cars.find(car => car.id === id);
    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const index = this.cars.findIndex(car => car.id === id);
    this.cars[index].available = available;
  }
}

export { CarsRepositoryInMemory };
