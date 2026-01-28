import {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  ObjectLiteral,
  QueryRunner,
  Repository as TypeOrmRepository,
} from "typeorm";

export interface Repository extends Function {
  new (
    target: EntityTarget<any>,
    manager: EntityManager,
    queryRunner?: QueryRunner
  ): TypeOrmRepository<ObjectLiteral>;
}

export class RepositoryWrapper<Entity> extends TypeOrmRepository<Entity> {
  override async findOne(
    options?: FindOneOptions<Entity>
  ): Promise<Entity | null> {
    const where = options?.where;
    // get columns
    const columns = (this?.metadata?.columns || []).map(
      (col) => col.propertyName
    );
    // if missing options or missing where => not need to find
    if (!where || typeof where !== "object") {
      return null;
    }
    // if any primary key is undefined => return null
    for (const key of columns) {
      if ((where || {}).hasOwnProperty(key)) {
        if ((where || {})[key] === undefined) {
          return null;
        }
      }
    }
    return super.findOne(options);
  }
}
