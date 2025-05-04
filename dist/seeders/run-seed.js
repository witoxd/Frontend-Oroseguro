"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const inquirer_1 = __importDefault(require("inquirer"));
const runSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    const { configure } = yield inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'configure',
            message: '¿Quieres configurar la base de datos antes de ejecutar el seeder?',
            default: true
        }
    ]);
    if (configure) {
        console.log('Configurando la base de datos...');
        yield new Promise((resolve) => {
            (0, child_process_1.exec)('npx ts-node src/seeders/select-db.ts', (error) => {
                if (error) {
                    console.error('❌ Error al configurar la base de datos:', error);
                    process.exit(1);
                }
                resolve(true);
            });
        });
    }
    console.log('Ejecutando el seeder...');
    (0, child_process_1.exec)('npx ts-node src/seeders/seed.ts', (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error al ejecutar el seeder:', error);
            return;
        }
        if (stderr) {
            console.error('❌ Error:', stderr);
            return;
        }
        console.log('✅ Seeder ejecutado exitosamente');
    });
});
runSeeder();
