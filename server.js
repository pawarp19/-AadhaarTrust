const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/get-otp', (req, res) => {
    const { aadhaarNumber } = req.body;

    const config = {
        method: 'post',
        url: 'https://api-preproduction.signzy.app/api/v3/getOkycOtp',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'pKOtFz4UmMHwR2aeu432uPzdNEdzvP8H'
        },
        data: JSON.stringify({ aadhaarNumber })
    };

    axios(config)
        .then(response => {
            const { requestId, otpSentStatus, isValidAadhaar } = response.data.data;
            if (otpSentStatus && isValidAadhaar) {
                res.json({ success: true, requestId });
            } else {
                res.json({ success: false, message: 'Failed to send OTP' });
            }
        })
        .catch(error => res.json({ success: false, error: error.message }));
});

app.post('/verify-otp', (req, res) => {
    const { requestId, otp } = req.body;

    const config = {
        method: 'post',
        url: 'https://api-preproduction.signzy.app/api/v3/fetchOkycData',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'pKOtFz4UmMHwR2aeu432uPzdNEdzvP8H'
        },
        data: JSON.stringify({ requestId, otp })
    };

    axios(config)
        .then(response => res.json({ success: true, result: response.data.data }))
        .catch(error => res.json({ success: false, error: error.message }));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
