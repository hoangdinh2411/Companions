"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOfCommodityEnum = exports.DeliveryOrderStatusEnum = void 0;
var DeliveryOrderStatusEnum;
(function (DeliveryOrderStatusEnum) {
    DeliveryOrderStatusEnum["ACTIVE"] = "active";
    DeliveryOrderStatusEnum["COMPLETED"] = "completed";
    DeliveryOrderStatusEnum["CANCELED"] = "canceled";
})(DeliveryOrderStatusEnum || (exports.DeliveryOrderStatusEnum = DeliveryOrderStatusEnum = {}));
var TypeOfCommodityEnum;
(function (TypeOfCommodityEnum) {
    TypeOfCommodityEnum["FOOD"] = "food";
    TypeOfCommodityEnum["PACKAGE"] = "package";
    TypeOfCommodityEnum["DOCUMENT"] = "document";
})(TypeOfCommodityEnum || (exports.TypeOfCommodityEnum = TypeOfCommodityEnum = {}));
