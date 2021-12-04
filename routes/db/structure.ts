import {DataTypes, Model} from "sequelize";

export class LinkAlias extends Model {
    initial!: string;
    uuid!: string;
    index!: number;
}

export function init(sequelize: any) {
    LinkAlias.init({
        initial: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        uuid: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            defaultValue: DataTypes.UUIDV4
        },
        index: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        sequelize,
        modelName: 'LinkAlias',
        indexes: [
            {
                name: "initial",
                fields: ["initial", "uuid", "initial"],
                unique: true
            }
        ]
    });
}