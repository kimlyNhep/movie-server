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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederUser1623259257213 = void 0;
class SeederUser1623259257213 {
    constructor() {
        this.name = 'SeederUser1623259257213';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`INSERT INTO "user" ("id","email","username","role","password","photo") VALUES ('4659524d-878b-4eb1-8999-0ceb5d7e5baf','kimly@gmail.com','kimly','Admin','$2a$12$GZElV9fpEvqg8by326tdsegagefo7twloY3jkXZk6wm2F51bsIAlK','https://movie-academy.herokuapp.com/profile/default.png')`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.SeederUser1623259257213 = SeederUser1623259257213;
//# sourceMappingURL=1623259257213-SeederUser.js.map