# **GunKustom Data Intelligence Workflow**

---

## **Introduction**

**GunKustom** is an innovative platform designed to revolutionize data management for firearm parts, accessories, and ammunition. By handling multiple vendors and supporting various U.S.-approved weapon platforms, our system standardizes, categorizes, and monitors data efficiently, ensuring compliance with regulations. This presentation outlines our architecture, explains the significance of each component, and introduces the potential use of Regex for enhanced precision.

---

## **1. GunKustom Data Normalizer**

### **Purpose:**

The **GunKustom Data Normalizer** transforms raw and inconsistent data from vendors into a standardized format. It ensures that the data, whether from APIs or file uploads, is validated and ready for efficient storage and processing.

### **Current Code:**

```typescript
import { keywordAssociations } from './keyword-associations';

export class GunKustomDataNormalizer {
  static normalizePartData(part: any, platform: string): any {
    if (!this.isSupportedPlatform(platform)) return null;

    return {
      name: this.getString(part.name, 'Unknown Part'),
      partType: this.inferPartType(part, platform),
      brand: this.getString(part.Brand, 'Unknown Brand'),
      caliber: this.getString(part.Caliber, 'UNK'),
      material: this.getString(part.Material, 'Unknown Material'),
      finish: this.getString(part.Finish, 'Unknown Finish'),
      msrp: this.getNumber(part.MSRP, 0),
      salePrice: this.getNumber(part.Sale_Price, 0),
      imageUrl: this.getString(part.Image, ''),
      description: this.getString(part.Description, 'No description available'),
      validated: this.getBoolean(part.Validated, false),
      createdAt: this.getDate(part.created_at),
    };
  }

  static inferPartType(part: any, platform: string): string {
    const title = part.name || part.Title || part.Product_Name || '';
    const lowerTitle = title.toLowerCase();

    const platformKeywords = keywordAssociations[platform.toLowerCase()] || {};
    for (const [partType, keywords] of Object.entries(platformKeywords)) {
      if (keywords.some((keyword) => lowerTitle.includes(keyword))) {
        return partType;
      }
    }
    return 'Unknown Part Type';
  }

  static isSupportedPlatform(platform: string): boolean {
    return ['ar15', 'shotgun', 'pistol', 'hunting_rifle'].includes(platform.toLowerCase());
  }

  // Helper methods for data validation
  static getString(value: any, defaultValue: string): string {
    return typeof value === 'string' && value.trim() !== '' ? value : defaultValue;
  }

  static getNumber(value: any, defaultValue: number): number {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string' && !isNaN(parseFloat(value))) return parseFloat(value);
    return defaultValue;
  }

  static getBoolean(value: any, defaultValue: boolean): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return defaultValue;
  }

  static getDate(value: any): string {
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value).toISOString();
    }
    return new Date().toISOString();
  }
}
```

### **Explanation of Current Logic:**

1. **Platform Filtering**: The `isSupportedPlatform` method ensures data is only processed for platforms approved in the U.S., like AR-15s, shotguns, pistols, and hunting rifles.
2. **Data Normalization**: The `normalizePartData` method converts fields like `name`, `brand`, `caliber`, and `msrp` into a standardized format for consistent data handling.
3. **Part Type Inference**: Uses keyword-based substring matching to determine the type of part based on its name or description.

### **Potential for Using Regex:**

Currently, our `inferPartType` method relies on simple substring matching (`includes`), which may lead to inefficiencies or false positives. By integrating **Regular Expressions (Regex)**, we can achieve more precise and flexible keyword matching.

### **Regex Enhanced Code:**

```typescript
static inferPartType(part: any, platform: string): string {
  const title = part.name || part.Title || part.Product_Name || '';
  const lowerTitle = title.toLowerCase();

  const platformKeywords = keywordAssociations[platform.toLowerCase()] || {};
  for (const [partType, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some((keyword) => new RegExp(`\\b${keyword}\\b`).test(lowerTitle))) {
      return partType;
    }
  }
  return 'Unknown Part Type';
}
```

### **Benefits of Using Regex:**

1. **Precision**: Matches whole words, reducing the risk of incorrect categorization (e.g., "hand" would not mistakenly match "handguard").
2. **Flexibility**: Can handle complex patterns, such as variations in spelling or optional characters.
3. **Efficiency**: Improves the accuracy of part type inference, especially for ambiguous or multi-word part names.

### **Considerations:**

- **Complexity**: Regex can be more challenging to maintain, so it should be used thoughtfully.
- **Performance**: While efficient for most use cases, complex Regex patterns may impact performance if not optimized.

---

## **2. GunKustom Keyword Associations**

### **Purpose:**

The **Keyword Associations** map part types to a set of keywords for each supported weapon platform. This mapping enables the **Data Normalizer** to accurately infer part types, which is crucial for categorization and inventory management.

### **Code:**

```typescript
export const keywordAssociations = {
  ar15: {
    'Upper Receiver': ['upper receiver', 'ar-15 upper'],
    'Lower Receiver': ['lower receiver', 'ar-15 lower'],
    'Handguard': ['handguard', 'rail system'],
    'Barrel': ['barrel', 'rifle barrel'],
    'Bolt Carrier Group': ['bolt carrier', 'bcg'],
    'Charging Handle': ['charging handle'],
    'Gas Block': ['gas block', 'gas system'],
    'Stock': ['stock', 'buttstock'],
    'Pistol Grip': ['pistol grip', 'grip'],
    'Trigger': ['trigger', 'match trigger'],
    'Muzzle Device': ['muzzle brake', 'flash hider', 'compensator'],
  },
  shotgun: {
    'Barrel': ['shotgun barrel'],
    'Stock': ['shotgun stock'],
    'Choke': ['choke tube', 'shotgun choke'],
  },
  pistol: {
    'Slide': ['pistol slide'],
    'Grip': ['pistol grip'],
    'Magazine': ['pistol mag', 'pistol magazine'],
  },
  hunting_rifle: {
    'Scope': ['rifle scope', 'hunting scope'],
    'Barrel': ['hunting rifle barrel'],
    'Stock': ['rifle stock'],
  }
};
```

### **Why This is Unique:**

- **Efficient Categorization**: Enables precise part classification, essential for inventory and user interfaces.
- **Customizable and Scalable**: Easily extendable to support additional platforms and new keywords.
- **Compliance Focus**: Only includes U.S.-approved weapon platforms, adhering to legal standards.

---

## **3. GunKustom Parts Service**

### **Purpose:**

The **GunKustom Parts Service** orchestrates the entire data processing workflow, from data ingestion to normalization, categorization, and price monitoring. It can handle data from both API sources and file uploads, making it versatile and robust.

### **Code:**

```typescript
import { Injectable } from '@nestjs/common';
import { GunKustomDataNormalizer } from './utils/data-normalizer';
import { PriceWatcher } from './utils/price-watcher';
import { FileReader } from '../../../utils/file-reader';
import { WeaponPart } from './schemas/weapon-part.schema';

@Injectable()
export class GunKustomPartsService {
  async processAPIData(apiData: any, platform: string): Promise<WeaponPart[]> {
    const normalizedData = apiData
      .map((item: any) => GunKustomDataNormalizer.normalizePartData(item, platform))
      .filter((part: WeaponPart) => this.isRelevantPart(part, platform));

    const priceUpdatedData = PriceWatcher.trackPriceChanges(normalizedData);

    return priceUpdatedData;
  }

  async processFileData(vendor: string, fileType: string, platform: string): Promise<WeaponPart[]> {
    const rawData = await FileReader.readFile(`src/data/${vendor}.${fileType}`);

    const normalizedData = rawData
      .map((item: any) => GunKustomDataNormalizer.normalizePartData(item, platform))
      .filter((part: WeaponPart) => this.isRelevantPart(part, platform));

    const priceUpdatedData = PriceWatcher.trackPriceChanges(normalizedData);

    return priceUpdatedData;
  }

  private isRelevantPart(part: WeaponPart, platform: string): boolean {
    const relevantPartsList = {
      ar15: ['Upper Receiver', 'Lower Receiver', 'Handguard', 'Barrel', 'Bolt Carrier Group', 'Charging Handle', 'Gas Block', 'Stock', 'Pistol Grip', 'Trigger', 'Muzzle Device'],
      shotgun: ['Barrel', 'Stock', 'Choke'],
      pistol: ['Slide', 'Grip', 'Magazine'],
      hunting_rifle: ['Scope', 'Barrel', 'Stock'],
    };
    return relevantPartsList[platform.toLowerCase()].includes(part.partType);
  }
}
```

### **Explanation of Logic:**

1. **Data Ingestion**: The `processAPIData` and `processFileData` methods handle data from APIs and file uploads, respectively. Both methods utilize the **Data Normalizer** to standardize the data and filter it based on relevance.
2. **Price Monitoring**: The **PriceWatcher** tracks changes in part prices and flags updates for users.
3. **Platform-Based Filtering**: The `isRelevantPart` method ensures that only parts specific to the designated weapon platform are processed and returned.

### **Why This is Unique:**

- **Centralized Workflow**: Manages the entire data lifecycle efficiently, from ingestion to monitoring.
- **Adaptable Architecture**: Easily extendable to support additional U.S.-approved platforms and vendors.
- **User Value**: Provides real-time price updates and accurate part categorization, enhancing user experience and trust.

---

## **4. GunKustom Intelligent Price Watching**

### **Purpose:**

The **PriceWatcher** algorithm automates price tracking, ensuring that our database reflects the latest information and keeping users informed of any price changes.

### **Code:**

```typescript
export class PriceWatcher {
  static trackPriceChanges(data: any[]): any[] {
    return data.map(item => {
      const previousPrice = item.previousPrice || item.msrp;
      item.priceChanged = item.salePrice !== previousPrice;
      item.previousPrice = item.salePrice; // Update for future comparisons
      return item;
    });
  }
}
```

### **Explanation:**

1. **Automated Monitoring**: The `trackPriceChanges` method compares the current sale price with the previous price and flags any changes.
2. **Real-Time Updates**: Ensures users receive timely notifications about price fluctuations.
3. **Data Integrity**: Updates the `previousPrice` field for future monitoring.

### **Why This is Unique:**

- **Efficiency**: Reduces the need for manual price checks, saving time and resources.
- **User-Centric**: Enhances the user experience by providing real-time, actionable insights.
- **Business Value**: Helps users make informed purchasing decisions, boosting engagement and trust.

---

## **Potential for Regex in the Workflow**

### **Current Challenge:**

- Our existing substring matching approach in `inferPartType` may lead to inefficiencies or inaccuracies, especially for ambiguous or multi-word part names.

### **Regex Solution:**

- **Precision**: Regex can precisely match whole words or complex patterns, ensuring accurate part type inference.
- **Flexibility**: Easily accommodates variations in spelling, optional characters, or case insensitivity.

### **Example of Regex Implementation:**

```typescript
static inferPartType(part: any, platform: string): string {
  const title = part.name || part.Title || part.Product_Name || '';
  const lowerTitle = title.toLowerCase();

  const platformKeywords = keywordAssociations[platform.toLowerCase()] || {};
  for (const [partType, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some((keyword) => new RegExp(`\\b${keyword}\\b`).test(lowerTitle))) {
      return partType;
    }
  }
  return 'Unknown Part Type';
}
```

### **Benefits of Using Regex:**

1. **Precision**: Reduces false positives by matching exact words or patterns.
2. **Flexibility**: Adapts to more complex keyword matching requirements.
3. **Efficiency**: Streamlines part categorization, enhancing data accuracy.

### **Considerations:**

- **Complexity**: Regex patterns can be difficult to maintain, so they should be well-documented.
- **Performance**: Care must be taken to optimize Regex patterns, especially with large datasets.

---

## **Conclusion: Why GunKustom is Unique**

1. **Comprehensive and Scalable**: GunKustom's architecture can handle a wide range of U.S.-approved weapon platforms and is designed for easy expansion.
2. **Data Accuracy and Compliance**: Our focus on data normalization, price tracking, and platform-specific logic ensures that we meet regulatory requirements and deliver reliable information.
3. **User-Focused Innovations**: With features like real-time price monitoring and precise part categorization, GunKustom provides significant value to users and sets us apart in the firearms data management industry.
