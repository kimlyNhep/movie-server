// import { getEnvHost } from '../utils/helper';
// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class SeederUser1623259257213 implements MigrationInterface {
//   name = 'SeederUser1623259257213';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `INSERT INTO "user" ("id","email","username","role","password","photo") VALUES ('4659524d-878b-4eb1-8999-0ceb5d7e5baf','kimly@gmail.com','kimly','Admin','$2a$12$GZElV9fpEvqg8by326tdsegagefo7twloY3jkXZk6wm2F51bsIAlK','${getEnvHost()}/profile/default.png')`
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {}
// }
