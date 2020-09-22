import { isBuffer } from "util";

export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

export class GildedRose {
    items: Array<Item>;

    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let sellInDecrease = this.determineSellIn(item);
            let qualityChange = this.determineQuality(item);

            item.sellIn = item.sellIn - sellInDecrease;
            item.quality = qualityChange;

            this.items[i] = item;
        }
        return this.items;
    }

    isSellInDatePassed(item: Item): boolean {
        return item.sellIn < 0;
    }

    isAgedBrie(item: Item): boolean {
        return item.name === 'Aged Brie';
    }

    isBackStagePass(item: Item): boolean {
        return item.name === 'Backstage passes to a TAFKAL80ETC concert';
    }

    isSulfuras(item: Item): boolean {
        return item.name === 'Sulfuras, Hand of Ragnaros';
    }

    isConjuredItem(item: Item): boolean {
        return item.name.toLowerCase().indexOf('conjured') >= 0;
    }

    determineSellIn(item: Item): number {
        return this.isSulfuras(item) ? SellInDecrease.NO_DECREASE : SellInDecrease.STANDARD_DECREASE;
    }

    determineQuality(item: Item): number {
        let value = QualityChange.STANDARD_DECREASE;
        let isDecreasing = true;

        if(this.isSulfuras(item)) {
            return QualityChange.LEGENDARY_ITEM;
        }
        
        if(this.isSellInDatePassed(item)){
            value = value * 2;
        }

        if(this.isAgedBrie(item)) {
            value = QualityChange.INCREASE;
            isDecreasing = false;
        }

        if(this.isBackStagePass(item)) {
            isDecreasing = false;
            let actualSellIn = item.sellIn - 1;
            if(actualSellIn > 10) {
                value = QualityChange.INCREASE;
            } else if(actualSellIn <= 10 && actualSellIn > 5) {
                value = QualityChange.DOUBLE_INCREASE;
            } else if(actualSellIn <= 5 && actualSellIn >= 0) {
                value = QualityChange.TRIPLE_INCREASE;
            } else {
                return QualityChange.NO_CHANGE;
            }
        }

        if(this.isConjuredItem(item)) {
            value *= 2;
        }
        
        if(isDecreasing) {
            return this.isQualityAllowedToDecrease(item.quality, value) ? (item.quality + value) : QualityChange.NO_CHANGE;
        } else {
            return this.isQualityAllowedToIncrease(item.quality, value) ? (item.quality + value) : QualityChange.MAX_DEFAULT;
        }
    }

    isQualityAllowedToIncrease(current: number, increase: number): boolean {
        return (current + increase) <= 50;
    }

    isQualityAllowedToDecrease(current: number, decrease: number): boolean {    
        return (current + decrease) >= 0;
    }
}

export enum SellInDecrease {
    NO_DECREASE = 0,
    STANDARD_DECREASE = 1
}

export enum QualityChange {
    STANDARD_DECREASE = -1,
    NO_CHANGE = 0,
    INCREASE = 1,
    DOUBLE_INCREASE = 2,
    TRIPLE_INCREASE = 3,
    MAX_DEFAULT = 50,
    LEGENDARY_ITEM = 80
}