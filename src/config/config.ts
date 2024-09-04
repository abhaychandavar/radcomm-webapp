const config = {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:9090',
    url: 'http://localhost:3000',
    firebaseConfig: {
        apiKey: "AIzaSyB-cVs6wnLLHfpVBV5jC9pvESoqZ821rwo",
        authDomain: "radcomm-88c57.firebaseapp.com",
        projectId: "radcomm-88c57",
        storageBucket: "radcomm-88c57.appspot.com",
        messagingSenderId: "574855561258",
        appId: "1:574855561258:web:4c6c3a30ef8bf406c00353",
        measurementId: "G-CMX61HT2GQ"
      },
    fcm: {
        vapidkey: 'BEsfD5AZNdJdr4_GW66tBGeRjHSjTNJfFsnkjxvSmE2Fs-FVG3aiELOdwi3nsaQrxhowgQz-U2n2VTyFGXUrugw'
    },
    hero: {
        videoUrl: "https://vmpn09wz4fdok1nr.public.blob.vercel-storage.com/earthTech-wH4vyqrkooHe1Z8eb2kRhdAuaenpXX.mp4"
    }
}

export default config;