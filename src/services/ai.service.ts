/**
 * SEMBAKO-CHAIN AI CORE ENGINE (PRODUCTION READY)
 * Terhubung ke Model AI eksternal & Database
 */

const AI_SERVER_URL = process.env.AI_SERVER_URL || "https://api-ai.sembako-chain.ai";

// 1. AI CROP CHECK (CNN - EfficientNetB0)
export const analyzeCropHealth = async (imageFile: File | string) => {
    try {
        const formData = new FormData();
        formData.append("file", imageFile);

        // Kirim foto ke Model CNN Python
        const response = await fetch(`${AI_SERVER_URL}/vision/detect-disease`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return {
            status: data.label, // Misal: "LEAF_BLIGHT" atau "HEALTHY"
            confidence: data.confidence,
            recommendation: data.treatment,
            impactOnHarvest: data.delay_days // Delay hari dari model AI
        };
    } catch (error) {
        throw new Error("Gagal memproses Image Recognition CNN");
    }
};

// 2. AI MARKET PREDICTIVE (LSTM - Time Series)
export const predictMarketInflation = async (komoditas: string, historicalPrices: number[]) => {
    try {
        // Model LSTM butuh input urutan harga historis (Sequence)
        const response = await fetch(`${AI_SERVER_URL}/market/predict-inflation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ komoditas, prices: historicalPrices }),
        });

        const data = await response.json();
        return {
            predictedPrice: data.next_30_days_avg,
            inflationRisk: data.risk_score, // 0.0 - 1.0
            isAnomaly: data.is_anomaly, // Deteksi penimbunan/kelangkaan
            suggestedAction: data.recommendation // Output dari Agent AI
        };
    } catch (error) {
        throw new Error("Gagal memproses Prediksi Ekonomi LSTM");
    }
};

// 3. AI ROUTE OPTIMIZER (Reinforcement Learning - VRP)
export const optimizeDeliveryRoute = async (locations: {id: string, lat: number, lng: number}[]) => {
    try {
        // Model RL untuk TSP/VRP (Vehicle Routing Problem)
        const response = await fetch(`${AI_SERVER_URL}/logistics/optimize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ points: locations }),
        });

        const data = await response.json();
        return {
            optimizedPath: data.best_route, // Urutan ID lokasi yang paling efisien
            savings: data.efficiency_gain, // Persentase penghematan BBM
            estimatedTime: data.eta
        };
    } catch (error) {
        throw new Error("Gagal memproses Optimasi Rute RL");
    }
};