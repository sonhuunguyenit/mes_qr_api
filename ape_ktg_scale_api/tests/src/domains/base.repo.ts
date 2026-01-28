import { Repository, FindOneOptions, DeepPartial, SaveOptions } from "typeorm";

export class BaseRepo<Entity> extends Repository<Entity> {
  async findOrCreate(value: Partial<Entity>, options?: FindOneOptions<Entity>) {
    let entity = (await this.findOne(options)) as any;

    if (!entity) {
      entity = await this.save(value as DeepPartial<Entity>);
    }
    return entity;
  }
  async saves(entities: DeepPartial<Entity>[], options: SaveOptions = {}) {
    const newOption: SaveOptions = { reload: true, chunk: 10000, ...options };
    return this.save(entities, newOption);
  }
}
