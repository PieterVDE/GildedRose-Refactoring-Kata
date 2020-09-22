import { expect} from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Basic items', function () {
    it('should decrease sellIn each day', function () {
        let sellIn = 10;
        const gildedRose = new GildedRose([new Item('foo', sellIn, 0)]);
        const items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.equal(sellIn - 1);
    });
    it('should decrease quality each day', function () {
        let quality = 10;
        const gildedRose = new GildedRose([new Item('foo', 0, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(quality - 1);
    });
});

describe('Basic items (extra rules)', function () {
    it('should degrade quality twice as fast when sell by date has passed', function () {
        let quality = 10;
        const gildedRose = new GildedRose([new Item('foo', -1, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(quality - 2);
    });
    it('should never have negative value for quality', function () {
        let quality = 0;
        const gildedRose = new GildedRose([new Item('foo', -1, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(0);
    });
    it('should never have quality over 50', function () {
        let quality = 50;
        const gildedRose = new GildedRose([new Item('Aged Brie', 1, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(50);
    });
});

describe('Aged brie', function () {
    it('should increase quality the older it gets', function () {
        let quality = 1;
        const gildedRose = new GildedRose([new Item('Aged Brie', 1, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(quality + 1);
    });
});

describe('Sulfuras, Hand of Ragnaros (legendary item)', function () {
    it('should never be sold or decrease in quality', function () {
        let quality = 80;
        let sellIn = 1;
        const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', sellIn, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.equal(sellIn);
        expect(items[0].quality).to.equal(quality);
    });
});

describe('Backstage passes', function () {
    it('should increase quality by 2 when there are 10 days or less', function () {
        let quality = 1;
        let sellIn = 10;
        const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', sellIn, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(quality + 2);
    });
    it('should increase quality by 3 when there are 5 days or less', function () {
        let quality = 1;
        let sellIn = 5;
        const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', sellIn, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(quality + 3);
    });
    it('should drop quality to 0 after the concert', function () {
        let quality = 10;
        let sellIn = 0;
        const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', sellIn, quality)]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(0);
    });
});

describe('Conjured items', function () {
    it('should degrade twice as fast as normal items', function () {
        let sellIn = 10;
        let quality = 10;
        const gildedRose = new GildedRose([new Item('Conjured foo', sellIn, 2)]);
        const items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.equal(sellIn - 2);
        expect(items[0].quality).to.equal(quality - 2);
    });
});