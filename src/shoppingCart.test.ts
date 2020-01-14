import {
  Checkout,
  NoDiscountStrategy,
  QuantityDiscountStrategy
} from "./shoppingCart";

const skuPrices = {
  A: 50,
  B: 30,
  C: 20,
  D: 15
};

const discountPrices = {
  A: { quantity: 3, price: 130 },
  B: { quantity: 2, price: 45 }
};

describe("checkout", () => {
  it("should return 0 when calculating the total price of no items", () => {
    const pricingStrategy = new NoDiscountStrategy(skuPrices);
    const checkout = new Checkout(pricingStrategy);
    expect(checkout.getTotal()).toBe(0);
  });

  it.each`
    input  | expected
    ${"A"} | ${50}
    ${"B"} | ${30}
    ${"C"} | ${20}
    ${"D"} | ${15}
  `(
    "should return price when calculating the total price of an item",
    ({ input, expected }) => {
      const pricingStrategy = new NoDiscountStrategy(skuPrices);
      const checkout = new Checkout(pricingStrategy);
      checkout.scanItem(input);
      expect(checkout.getTotal()).toBe(expected);
    }
  );

  it.each`
    input     | expected
    ${"AB"}   | ${80}
    ${"CDBA"} | ${115}
  `(
    "should return total price when calculating the price of multiple items",
    ({ input, expected }) => {
      const pricingStrategy = new NoDiscountStrategy(skuPrices);
      const checkout = new Checkout(pricingStrategy);
      input.split("").forEach((item: string) => {
        checkout.scanItem(item);
      });
      expect(checkout.getTotal()).toBe(expected);
    }
  );

  it.each`
    input       | expected
    ${"AA"}     | ${100}
    ${"AAA"}    | ${130}
    ${"AAAA"}   | ${180}
    ${"AAAAA"}  | ${230}
    ${"AAAAAA"} | ${260}
  `(
    "should return $expected when calculating the price of '$input'",
    ({ input, expected }) => {
      const pricingStrategy = new QuantityDiscountStrategy(
        skuPrices,
        discountPrices
      );
      const checkout = new Checkout(pricingStrategy);
      input.split("").forEach((item: string, index: number) => {
        checkout.scanItem(item);
      });
      expect(checkout.getTotal()).toBe(expected);
    }
  );

  it.each`
    input       | expected
    ${"AAAB"}   | ${160}
    ${"AAABB"}  | ${175}
    ${"AAABBD"} | ${190}
    ${"DABABA"} | ${190}
  `(
    "should return $expected when calculating the price of '$input' based on the discount strategy provided",
    ({ input, expected }) => {
      const pricingStrategy = new QuantityDiscountStrategy(
        skuPrices,
        discountPrices
      );
      const checkout = new Checkout(pricingStrategy);
      input.split("").forEach((item: string, index: number) => {
        checkout.scanItem(item);
      });
      expect(checkout.getTotal()).toBe(expected);
    }
  );
});
