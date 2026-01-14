// Brain Tumor Dataset Processor
class DatasetProcessor {
    constructor() {
        this.dataset = {
            training: { normal: [], abnormal: [] },
            validation: { normal: [], abnormal: [] },
            testing: { normal: [], abnormal: [] }
        };
        this.processedImages = [];
        this.features = [];
        this.statistics = {};
    }

    // Process uploaded dataset files
    async processDatasetFiles(files) {
        console.log('Processing dataset files:', files.length);
        
        const imageFiles = Array.from(files).filter(file => 
            file.type.startsWith('image/') || file.name.endsWith('.dcm')
        );
        
        if (imageFiles.length === 0) {
            throw new Error('No valid image files found in dataset');
        }

        // Categorize images based on filename or folder structure
        this.categorizeImages(imageFiles);
        
        // Process each image to extract features
        await this.extractFeaturesFromImages();
        
        // Generate dataset statistics
        this.generateStatistics();
        
        return this.statistics;
    }

    // Categorize images as normal or abnormal
    categorizeImages(files) {
        files.forEach(file => {
            const fileName = file.name.toLowerCase();
            
            if (fileName.includes('normal') || fileName.includes('healthy') || fileName.includes('no_tumor')) {
                this.dataset.training.normal.push(file);
            } else if (fileName.includes('tumor') || fileName.includes('abnormal') || fileName.includes('cancer')) {
                this.dataset.training.abnormal.push(file);
            } else {
                // Default to abnormal if unsure
                this.dataset.training.abnormal.push(file);
            }
        });

        // Split into training/validation/testing (80/10/10)
        this.splitDataset();
    }

    // Split dataset into training, validation, and testing sets
    splitDataset() {
        const totalNormal = this.dataset.training.normal.length;
        const totalAbnormal = this.dataset.training.abnormal.length;
        
        // Training: 80%
        const trainNormalCount = Math.floor(totalNormal * 0.8);
        const trainAbnormalCount = Math.floor(totalAbnormal * 0.8);
        
        // Validation: 10%
        const valNormalCount = Math.floor(totalNormal * 0.1);
        const valAbnormalCount = Math.floor(totalAbnormal * 0.1);
        
        // Testing: 10%
        const testNormalCount = totalNormal - trainNormalCount - valNormalCount;
        const testAbnormalCount = totalAbnormal - trainAbnormalCount - valAbnormalCount;
        
        // Move files to appropriate sets
        this.dataset.validation.normal = this.dataset.training.normal.splice(trainNormalCount, valNormalCount);
        this.dataset.testing.normal = this.dataset.training.normal.splice(trainNormalCount, testNormalCount);
        
        this.dataset.validation.abnormal = this.dataset.training.abnormal.splice(trainAbnormalCount, valAbnormalCount);
        this.dataset.testing.abnormal = this.dataset.training.abnormal.splice(trainAbnormalCount, testAbnormalCount);
    }

    // Extract features from images
    async extractFeaturesFromImages() {
        console.log('Extracting features from images...');
        
        const allImages = [
            ...this.dataset.training.normal,
            ...this.dataset.training.abnormal,
            ...this.dataset.validation.normal,
            ...this.dataset.validation.abnormal,
            ...this.dataset.testing.normal,
            ...this.dataset.testing.abnormal
        ];

        for (let i = 0; i < Math.min(allImages.length, 50); i++) { // Process max 50 images for demo
            const file = allImages[i];
            try {
                const features = await this.extractImageFeatures(file);
                this.features.push({
                    fileName: file.name,
                    features: features,
                    category: this.getImageCategory(file)
                });
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
            }
        }
    }

    // Extract features from a single image
    async extractImageFeatures(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 256;
                    canvas.height = 256;
                    
                    // Draw and resize image
                    ctx.drawImage(img, 0, 0, 256, 256);
                    
                    // Extract basic features
                    const imageData = ctx.getImageData(0, 0, 256, 256);
                    const features = this.calculateFeatures(imageData);
                    
                    resolve(features);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Calculate image features
    calculateFeatures(imageData) {
        const data = imageData.data;
        let totalR = 0, totalG = 0, totalB = 0;
        let totalPixels = data.length / 4;
        
        // Calculate mean RGB values
        for (let i = 0; i < data.length; i += 4) {
            totalR += data[i];
            totalG += data[i + 1];
            totalB += data[i + 2];
        }
        
        const meanR = totalR / totalPixels;
        const meanG = totalG / totalPixels;
        const meanB = totalB / totalPixels;
        
        // Calculate standard deviation
        let varianceR = 0, varianceG = 0, varianceB = 0;
        for (let i = 0; i < data.length; i += 4) {
            varianceR += Math.pow(data[i] - meanR, 2);
            varianceG += Math.pow(data[i + 1] - meanG, 2);
            varianceB += Math.pow(data[i + 2] - meanB, 2);
        }
        
        const stdR = Math.sqrt(varianceR / totalPixels);
        const stdG = Math.sqrt(varianceG / totalPixels);
        const stdB = Math.sqrt(varianceB / totalPixels);
        
        // Calculate texture features (simple edge detection)
        let edgeCount = 0;
        for (let y = 1; y < 256; y++) {
            for (let x = 1; x < 256; x++) {
                const idx = (y * 256 + x) * 4;
                const currentGray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                const leftGray = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3;
                const topGray = (data[idx - 256 * 4] + data[idx - 256 * 4 + 1] + data[idx - 256 * 4 + 2]) / 3;
                
                if (Math.abs(currentGray - leftGray) > 30 || Math.abs(currentGray - topGray) > 30) {
                    edgeCount++;
                }
            }
        }
        
        return {
            meanR: meanR.toFixed(2),
            meanG: meanG.toFixed(2),
            meanB: meanB.toFixed(2),
            stdR: stdR.toFixed(2),
            stdG: stdG.toFixed(2),
            stdB: stdB.toFixed(2),
            edgeDensity: (edgeCount / (256 * 256)).toFixed(4),
            contrast: ((meanR + meanG + meanB) / 3).toFixed(2),
            textureComplexity: (stdR + stdG + stdB).toFixed(2)
        };
    }

    // Get image category
    getImageCategory(file) {
        const fileName = file.name.toLowerCase();
        if (fileName.includes('normal') || fileName.includes('healthy')) {
            return 'Normal';
        } else {
            return 'Abnormal';
        }
    }

    // Generate dataset statistics
    generateStatistics() {
        this.statistics = {
            totalImages: this.dataset.training.normal.length + this.dataset.training.abnormal.length + 
                        this.dataset.validation.normal.length + this.dataset.validation.abnormal.length +
                        this.dataset.testing.normal.length + this.dataset.testing.abnormal.length,
            training: {
                normal: this.dataset.training.normal.length,
                abnormal: this.dataset.training.abnormal.length,
                total: this.dataset.training.normal.length + this.dataset.training.abnormal.length
            },
            validation: {
                normal: this.dataset.validation.normal.length,
                abnormal: this.dataset.validation.abnormal.length,
                total: this.dataset.validation.normal.length + this.dataset.validation.abnormal.length
            },
            testing: {
                normal: this.dataset.testing.normal.length,
                abnormal: this.dataset.testing.abnormal.length,
                total: this.dataset.testing.normal.length + this.dataset.testing.abnormal.length
            },
            features: this.features.length,
            categories: {
                normal: this.features.filter(f => f.category === 'Normal').length,
                abnormal: this.features.filter(f => f.category === 'Abnormal').length
            }
        };
    }

    // Get processed dataset summary
    getDatasetSummary() {
        return {
            statistics: this.statistics,
            features: this.features.slice(0, 10), // Return first 10 features for display
            dataset: this.dataset
        };
    }

    // Export dataset information
    exportDatasetInfo() {
        const summary = this.getDatasetSummary();
        const dataStr = JSON.stringify(summary, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'brain_tumor_dataset_summary.json';
        link.click();
    }
}

// Make it globally accessible
window.DatasetProcessor = DatasetProcessor;
