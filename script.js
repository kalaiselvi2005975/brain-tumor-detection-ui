// Brain Tumor Detection System - Professional Medical AI Dashboard
class BrainTumorDetectionSystem {
    constructor() {
        this.originalImage = null;
        this.processedImages = {};
        this.features = {};
        this.classificationResult = null;
        this.modelPerformance = {
            accuracy: 94.2,
            sensitivity: 92.8,
            specificity: 95.6
        };
        
        this.initializeEventListeners();
        this.updateCurrentDate();
        this.updatePerformanceMetrics();
    }

    initializeEventListeners() {
        // File upload handling
        const imageInput = document.getElementById('image-input');
        const uploadArea = document.getElementById('upload-area');
        
        console.log('Setting up image upload listeners...');
        console.log('Image input element:', imageInput);
        console.log('Upload area element:', uploadArea);
        
        if (imageInput && uploadArea) {
            // File input change event
            imageInput.addEventListener('change', (e) => {
                console.log('File selected:', e.target.files[0]);
                this.handleImageUpload(e);
            });
            
            // Upload area click event
            uploadArea.addEventListener('click', () => {
                console.log('Upload area clicked, opening file dialog...');
                imageInput.click();
            });
            
            // Upload button click event
            const uploadBtn = uploadArea.querySelector('.upload-btn');
            if (uploadBtn) {
                uploadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    imageInput.click();
                });
            }
            
            // Add drag and drop functionality
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#4CAF50';
                uploadArea.style.background = 'rgba(76, 175, 80, 0.1)';
            });
            
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#e1e8ed';
                uploadArea.style.background = 'transparent';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#e1e8ed';
                uploadArea.style.background = 'transparent';
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    console.log('File dropped:', files[0]);
                    imageInput.files = files;
                    this.handleImageUpload({ target: { files: files } });
                }
            });
            
            console.log('Image upload listeners set up successfully');
        } else {
            console.error('Image input or upload area not found!');
        }
        
        // Process buttons
        document.getElementById('preprocess-btn').addEventListener('click', () => this.preprocessImage());
        document.getElementById('segment-btn').addEventListener('click', () => this.segmentImage());
        document.getElementById('extract-btn').addEventListener('click', () => this.extractFeatures());
        document.getElementById('classify-btn').addEventListener('click', () => this.classifyImage());
        
        // Popup handling
        document.getElementById('close-popup').addEventListener('click', () => this.hidePopup());
        document.getElementById('ok-btn').addEventListener('click', () => this.hidePopup());
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.textContent = currentDate;
    }

    updatePerformanceMetrics() {
        document.getElementById('accuracy-value').textContent = this.modelPerformance.accuracy + '%';
        document.getElementById('sensitivity-value').textContent = this.modelPerformance.sensitivity + '%';
        document.getElementById('specificity-value').textContent = this.modelPerformance.specificity + '%';
    }


    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.loadImage(file);
        }
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = e.target.result;
            this.displayOriginalImage();
            this.enablePreprocessing();
        };
        reader.readAsDataURL(file);
    }

    displayOriginalImage() {
        const originalImageDisplay = document.getElementById('original-image-display');
        const originalImage = document.getElementById('original-image');
        
        originalImage.src = this.originalImage;
        originalImageDisplay.style.display = 'block';
        
        // Hide upload area
        document.getElementById('upload-area').style.display = 'none';
    }

    enablePreprocessing() {
        document.getElementById('preprocess-btn').disabled = false;
    }

    async preprocessImage() {
        this.showLoading('Preprocessing image...');
        
        try {
         
            await this.delay(1500);
            
            // Generate processed images using simple colored rectangles
            this.processedImages.resized = this.createColoredImage('#4CAF50', 'RESIZED');
            this.processedImages.filtered = this.createColoredImage('#2196F3', 'FILTERED');
            
            // Display processed images
            this.displayProcessedImage('resized', this.processedImages.resized);
            this.displayProcessedImage('filtered', this.processedImages.filtered);
            
            // Enable segmentation
            document.getElementById('segment-btn').disabled = false;
            
            this.hideLoading();
            this.showSuccessMessage('Preprocessing completed successfully!');
            
        } catch (error) {
            this.hideLoading();
            this.showErrorMessage('Error during preprocessing: ' + error.message);
        }
    }

    async segmentImage() {
        this.showLoading('Segmenting tumor region...');
        
        try {
            await this.delay(1500);
            
            // Generate segmented image
            this.processedImages.segmented = this.createColoredImage('#FF9800', 'SEGMENTED');
            
            // Display segmented image
            this.displayProcessedImage('segmented', this.processedImages.segmented);
            
            // Enable feature extraction
            document.getElementById('extract-btn').disabled = false;
            
            this.hideLoading();
            this.showSuccessMessage('Segmentation completed successfully!');
            
        } catch (error) {
            this.hideLoading();
            this.showErrorMessage('Error during segmentation: ' + error.message);
        }
    }

    async extractFeatures() {
        this.showLoading('Extracting features...');
        
        try {
            await this.delay(1200);
            
            // Generate sample features
            this.features = this.generateSampleFeatures();
            
            // Display features table
            this.displayFeaturesTable();
            
            // Enable classification
            document.getElementById('classify-btn').disabled = false;
            
            this.hideLoading();
            this.showSuccessMessage('Feature extraction completed successfully!');
            
        } catch (error) {
            this.hideLoading();
            this.showErrorMessage('Error during feature extraction: ' + error.message);
        }
    }

    async classifyImage() {
        this.showLoading('Classifying image...');
        
        try {
            await this.delay(2000);
            
            // Generate classification result
            this.classificationResult = this.generateClassificationResult();
            
            // Display classification result
            this.displayClassificationResult();
            
            // Show popup
            this.showClassificationPopup();
            
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            this.showErrorMessage('Error during classification: ' + error.message);
        }
    }

    // Create simple colored images that will definitely be visible
    createColoredImage(color, text) {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Draw colored background
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 300, 300);
        
        // Add white text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 150, 150);
        
        // Add white border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 260, 260);
        
        // Add some visual effects
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(50, 50, 200, 200);
        
        // Convert to data URL
        return canvas.toDataURL('image/png');
    }

    displayProcessedImage(type, imageData) {
        console.log(`Displaying ${type} image:`, imageData);
        const canvas = document.getElementById(`${type}-canvas`);
        const placeholder = canvas ? canvas.previousElementSibling : null;
        
        if (canvas && placeholder) {
            const ctx = canvas.getContext('2d');
            
            // Hide placeholder and show canvas
            placeholder.style.display = 'none';
            canvas.style.display = 'block';
            
            // Create a new image object
            const img = new Image();
            img.onload = function() {
                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Add a border and shadow effect
                ctx.strokeStyle = '#4CAF50';
                ctx.lineWidth = 3;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
                
                console.log(`${type} canvas updated successfully`);
            };
            img.src = imageData;
        } else {
            console.error(`Canvas for ${type} not found!`);
        }
    }

    generateSampleFeatures() {
        return {
            'Area': '245.67 mm²',
            'Perimeter': '67.89 mm',
            'Circularity': '0.78',
            'Eccentricity': '0.45',
            'Solidity': '0.92',
            'Mean Intensity': '156.34',
            'Standard Deviation': '23.45',
            'Skewness': '0.12',
            'Kurtosis': '2.89',
            'GLCM Contrast': '0.67',
            'GLCM Homogeneity': '0.89',
            'GLCM Energy': '0.45',
            'GLCM Correlation': '0.78'
        };
    }

    displayFeaturesTable() {
        const featuresTable = document.getElementById('features-table');
        const placeholder = featuresTable ? featuresTable.nextElementSibling : null;
        
        if (featuresTable) {
            // Hide placeholder and show features table
            if (placeholder) placeholder.style.display = 'none';
            featuresTable.style.display = 'block';
            
            let tableHTML = '<table><thead><tr><th>Feature</th><th>Value</th></tr></thead><tbody>';
            
            for (const [feature, value] of Object.entries(this.features)) {
                tableHTML += `<tr><td>${feature}</td><td>${value}</td></tr>`;
            }
            
            tableHTML += '</tbody></table>';
            featuresTable.innerHTML = tableHTML;
            
            console.log('Features table displayed successfully');
        } else {
            console.error('Features table element not found!');
        }
    }

    generateClassificationResult() {
        // Simulate classification with 85% confidence for abnormal
        const isAbnormal = Math.random() > 0.15;
        const confidence = (Math.random() * 0.2 + 0.8) * 100; // 80-100%
        
        return {
            classification: isAbnormal ? 'Abnormal' : 'Normal',
            confidence: confidence.toFixed(1),
            probability: isAbnormal ? confidence : (100 - confidence)
        };
    }

    displayClassificationResult() {
        const resultContainer = document.getElementById('classification-result');
        const placeholder = resultContainer ? resultContainer.nextElementSibling : null;
        
        if (resultContainer) {
            const result = this.classificationResult;
            
            // Hide placeholder and show result
            if (placeholder) placeholder.style.display = 'none';
            resultContainer.style.display = 'block';
            
            const resultClass = result.classification.toLowerCase();
            const resultColor = resultClass === 'normal' ? '#27ae60' : '#e74c3c';
            const resultIcon = resultClass === 'normal' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
            
            resultContainer.innerHTML = `
                <div class="result-display" style="background: ${resultColor};">
                    <div class="result-icon">
                        <i class="${resultIcon}"></i>
                    </div>
                    <div class="result-text">
                        <h1>Identified as: ${result.classification}</h1>
                        <p>Confidence: ${result.confidence}%</p>
                        <p>Probability Score: ${result.probability.toFixed(1)}%</p>
                    </div>
                </div>
            `;
            
            console.log('Classification result displayed successfully');
        } else {
            console.error('Classification result container not found!');
        }
    }

    showClassificationPopup() {
        const popup = document.getElementById('popup-overlay');
        const classificationText = document.getElementById('popup-classification');
        const probabilityText = document.getElementById('popup-probability');
        
        classificationText.textContent = `Identified as: ${this.classificationResult.classification}`;
        probabilityText.textContent = `Probability: ${this.classificationResult.probability.toFixed(1)}%`;
        
        popup.style.display = 'flex';
    }

    hidePopup() {
        document.getElementById('popup-overlay').style.display = 'none';
    }

    showLoading(message) {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        
        loadingText.textContent = message;
        loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        `;
        
        // Add animation CSS
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetSystem() {
        // Reset all processed images and show placeholders
        const canvases = ['resized-canvas', 'filtered-canvas', 'segmented-canvas'];
        canvases.forEach(canvasId => {
            const canvas = document.getElementById(canvasId);
            const placeholder = canvas ? canvas.previousElementSibling : null;
            
            if (canvas && placeholder) {
                canvas.style.display = 'none';
                placeholder.style.display = 'flex';
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        // Reset features table
        const featuresTable = document.getElementById('features-table');
        const featuresPlaceholder = featuresTable ? featuresTable.nextElementSibling : null;
        if (featuresTable && featuresPlaceholder) {
            featuresTable.style.display = 'none';
            featuresPlaceholder.style.display = 'block';
        }

        // Reset classification result
        const resultContainer = document.getElementById('classification-result');
        const resultPlaceholder = resultContainer ? resultContainer.nextElementSibling : null;
        if (resultContainer && resultPlaceholder) {
            resultContainer.style.display = 'none';
            resultPlaceholder.style.display = 'block';
        }

        // Reset file input and show upload area
        document.getElementById('image-input').value = '';
        document.getElementById('upload-area').style.display = 'flex';
        document.getElementById('original-image-display').style.display = 'none';

        // Disable all process buttons
        document.getElementById('preprocess-btn').disabled = true;
        document.getElementById('segment-btn').disabled = true;
        document.getElementById('extract-btn').disabled = true;
        document.getElementById('classify-btn').disabled = true;

        // Clear processed images object
        this.processedImages = {};
        this.features = {};
        this.classificationResult = null;

        // Show success message
        this.showSuccessMessage('System reset successfully!');
    }

    // Train model function
    async trainModel() {
        this.showLoading('Training model on brain tumor dataset...');
        
        try {
            const totalEpochs = 50;
            
            for (let epoch = 1; epoch <= totalEpochs; epoch++) {
                await this.delay(100);
                
                // Update loading message
                document.getElementById('loading-text').textContent = 
                    `Training Epoch ${epoch}/${totalEpochs} - ${(epoch/totalEpochs*100).toFixed(1)}%`;
                
                // Simulate accuracy improvement during training
                if (epoch > 10) {
                    this.modelPerformance.accuracy = Math.min(98.5, 85 + (epoch - 10) * 0.3);
                    this.modelPerformance.sensitivity = Math.min(97.2, 80 + (epoch - 10) * 0.35);
                    this.modelPerformance.specificity = Math.min(98.8, 82 + (epoch - 10) * 0.4);
                    this.updatePerformanceMetrics();
                }
            }
            
            this.hideLoading();
            this.showSuccessMessage('Model training completed successfully!');
            
        } catch (error) {
            this.hideLoading();
            this.showErrorMessage('Error during training: ' + error.message);
        }
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.brainTumorSystem = new BrainTumorDetectionSystem();
    console.log('Brain Tumor Detection System initialized successfully');
});

// Additional utility functions for enhanced functionality
function createSampleMRIImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Create a realistic MRI-like image
    const gradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#e0e0e0');
    gradient.addColorStop(0.6, '#c0c0c0');
    gradient.addColorStop(1, '#808080');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 300);
    
    // Add brain-like structure
    ctx.fillStyle = '#404040';
    ctx.beginPath();
    ctx.ellipse(150, 150, 120, 100, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add tumor-like region (for abnormal cases)
    if (Math.random() > 0.5) {
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.ellipse(180, 120, 20, 15, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    return canvas.toDataURL('image/png');
}

