import { MigrationInterface, QueryRunner } from 'typeorm'
import { PasswordUtil } from '../../shared/password'

export class addTableUser1618627467354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "app_user"
        (
            "id"                             serial       NOT NULL,
            "user_name"                      varchar(50)  NOT NULL,
            "email"                          varchar(255) NOT NULL,
            "first_name"                     varchar(50)  NOT NULL,
            "last_name"                      varchar(50)  NOT NULL,
            "password"                       varchar(255) NOT NULL,
            "avatar"                         varchar(255) NULL,
            "description"                    varchar      NULL,
            "location"                       varchar      NULL,
--                                  need to confirm social_media_links
            "social_media_links"             varchar      NULL,
            "facebook_id"                    varchar(255) NULL,
            "google_id"                      varchar(255) NULL,
            "linkedin_id"                    varchar(255) NULL,
            "is_enable"                      bool         NOT NULL DEFAULT true,
            "reset_password_token"           varchar(500) NULL,
            "reset_password_token_expired"   timestamp,
            "is_verified_account"            bool         NOT NULL DEFAULT false,
            "verified_account_token"         varchar(500) NULL,
            "verified_account_token_expired" timestamp,
            "created_at"                     timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "modified_at"                    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "created_by"                     int          NULL,
            "modified_by"                    int          NULL,

            CONSTRAINT "pk_app_user_id" PRIMARY KEY ("id"),

            CONSTRAINT "uq_app_user_user_name" UNIQUE ("user_name"),
            CONSTRAINT "uq_app_user_email" UNIQUE ("email"),
            CONSTRAINT "uq_app_user_facebook_id" UNIQUE ("facebook_id"),
            CONSTRAINT "uq_app_user_google_id" UNIQUE ("google_id"),
            CONSTRAINT "uq_app_user_linkedin_id" UNIQUE ("linkedin_id"),

            CONSTRAINT "fk_app_user_created_by" FOREIGN KEY ("created_by") REFERENCES app_user ("id"),
            CONSTRAINT "fk_app_user_modified_by" FOREIGN KEY ("modified_by") REFERENCES app_user ("id")
        );
        CREATE INDEX idx_app_user_user_name ON app_user (user_name ASC);
        CREATE INDEX idx_app_user_email ON app_user (email ASC);


        CREATE TABLE "app_role"
        (
            "id"           serial       NOT NULL,
            "name"         varchar(50)  NOT NULL,
            "description"  varchar(255) NOT NULL,
            "global_role"  bool         NOT NULL DEFAULT false,
            "project_role" bool         NOT NULL DEFAULT false,

            CONSTRAINT "pk_app_role" PRIMARY KEY ("id"),

            CONSTRAINT "unq_app_role_name" UNIQUE (name)
        );
        CREATE INDEX "idx_app_role_name" ON app_role (name ASC);


        CREATE TABLE "app_privilege"
        (
            "id"          serial       NOT NULL,
            "name"        varchar(50)  NOT NULL,
            "description" varchar(255) NOT NULL,

            CONSTRAINT "pk_app_privilege" PRIMARY KEY ("id"),

            CONSTRAINT "unq_app_privilege_name" UNIQUE (name)
        );
        CREATE INDEX "idx_app_privilege_name" ON app_privilege (name ASC);
    `)

    await queryRunner.query(`
        CREATE TABLE "app_user_role"
        (
            "id"      serial NOT NULL,
            "user_id" int    NOT NULL,
            "role_id" int    NOT NULL,

            CONSTRAINT "pk_app_user_role" PRIMARY KEY ("id"),

            CONSTRAINT "unq_app_user_role" UNIQUE (user_id, role_id),

            CONSTRAINT "fk_app_user_role_user_id" FOREIGN KEY (user_id) REFERENCES app_user (id),
            CONSTRAINT "fk_app_user_role_role_id" FOREIGN KEY (role_id) REFERENCES app_role (id)
        );

        CREATE TABLE "app_role_privilege"
        (
            "id"           serial NOT NULL,
            "privilege_id" int    NOT NULL,
            "role_id"      int    NOT NULL,

            CONSTRAINT "pk_app_role_privilege" PRIMARY KEY ("id"),

            CONSTRAINT "unq_app_role_privilege" UNIQUE (privilege_id, role_id),

            CONSTRAINT "fk_app_role_privilege_privilege_id" FOREIGN KEY (privilege_id) REFERENCES app_privilege (id),
            CONSTRAINT "fk_app_role_privilege_role_id" FOREIGN KEY (role_id) REFERENCES app_role (id)
        )
    `)

    const password = PasswordUtil.generateHash('enouvo@123')
    await queryRunner.query(`
        INSERT INTO app_role (name, description, global_role, project_role)
        VALUES ('SystemAdmin', 'System Admin', true, false),('User', 'Normal User', true, false);

        INSERT INTO app_user (user_name, email, first_name, last_name, password, is_enable)
        VALUES ('admin', 'ontherise@gmail.com', 'system', 'admin', '${password}', true);
    `)

    await queryRunner.query(`
        DO
            $$
                DECLARE
                    system_admin_role_id integer;
                BEGIN
                    SELECT id
                    INTO system_admin_role_id
                    FROM app_role
                    WHERE Name = 'SystemAdmin';
            
                    INSERT INTO app_user_role(user_id, role_id)
                    SELECT id AS user_id, system_admin_role_id AS role_id
                    FROM app_user
                    WHERE app_user.user_name IN ('admin');
                END;
            $$
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE app_role_privilege;
        DROP TABLE app_user_role;
        DROP TABLE app_user;
        DROP TABLE app_role;
        DROP TABLE app_privilege;
    `)
  }
}
