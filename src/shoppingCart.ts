interface ISkuPrices {
  [itemSku: string]: number;
}

interface IDiscounts {
  [itemSku: string]: { quantity: number; price: number };
}

interface ICartItems {
  [item: string]: number;
}

interface ICheckout {
  getTotal(): number;
  scanItem(item: string): void;
}

interface IPricingStrategy {
  getPrice(item: string, quantity: number): number;
}

export class NoDiscountStrategy implements IPricingStrategy {
  private skuPrices: ISkuPrices;

  constructor(skuPrices: ISkuPrices) {
    this.skuPrices = skuPrices;
  }

  getPrice(item: string, quantity: number) {
    return this.skuPrices[item] * quantity;
  }
}

export class QuantityDiscountStrategy implements IPricingStrategy {
  private skuPrices: ISkuPrices;
  private discounts: IDiscounts;

  constructor(skuPrices: ISkuPrices, discounts: IDiscounts) {
    this.skuPrices = skuPrices;
    this.discounts = discounts;
  }

  getPrice(item: string, quantity: number) {
    if (!this.discounts[item]) {
      return this.skuPrices[item] * quantity;
    }
    const discountedCount = Math.floor(
      quantity / this.discounts[item].quantity
    );
    const fullPricedItems = quantity % this.discounts[item].quantity;
    return (
      fullPricedItems * this.skuPrices[item] +
      discountedCount * this.discounts[item].price
    );
  }
}

export class Checkout implements ICheckout {
  private pricingStrategy: IPricingStrategy;
  private cartItems: ICartItems;

  constructor(pricingStrategy: IPricingStrategy) {
    this.cartItems = {};
    this.pricingStrategy = pricingStrategy;
  }

  getTotal() {
    const cartItemEntries = Object.entries(this.cartItems);
    return cartItemEntries.reduce(
      (previous, [itemSku, quantity]) =>
        previous + this.pricingStrategy.getPrice(itemSku, quantity),
      0
    );
  }

  scanItem(item: string) {
    this.cartItems[item] = (this.cartItems[item] || 0) + 1;
  }
}
