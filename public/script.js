document.getElementById('send-otp-btn').addEventListener('click', function(event) {
    const aadhaarNumber = document.getElementById('aadhaar-number').value;
    const messageDiv = document.getElementById('message');

    resetRightGrid(); // Reset the right grid before sending the OTP

    fetch('/get-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aadhaarNumber })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.textContent = 'OTP sent successfully. Please enter the OTP.';
            document.getElementById('otp-section').style.display = 'block';
            sessionStorage.setItem('requestId', data.requestId);
        } else {
            messageDiv.textContent = 'Failed to send OTP.';
        }
    })
    .catch(error => {
        messageDiv.textContent = 'An error occurred. Please try again.';
    });
});

document.getElementById('verify-otp-btn').addEventListener('click', function(event) {
    const otp = document.getElementById('otp').value;
    const requestId = sessionStorage.getItem('requestId');
    const messageDiv = document.getElementById('message');
    const aadhaarInfoDiv = document.getElementById('aadhaar-info');

    fetch('/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, otp })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.textContent = 'OTP verified successfully.';
            const { full_name, aadhaar_number, dob, gender, address, profile_image, email_hash, mobile_hash } = data.result;
            aadhaarInfoDiv.innerHTML = `
                <p><strong>Full Name:</strong> ${full_name}</p>
                <p><strong>Date of Birth:</strong> ${dob}</p>
                <p><strong>Aadhaar Number:</strong> ${aadhaar_number}</p>
                <p><strong>Gender:</strong> ${gender}</p>
                <p><strong>Country:</strong> ${address.country}</p>
                <p><strong>District:</strong> ${address.dist}</p>
                <p><strong>State:</strong> ${address.state}</p>
            `;
            resetForm();
        } else {
            messageDiv.textContent = 'Failed to verify OTP.';
        }
    })
    .catch(error => {
        messageDiv.textContent = 'An error occurred. Please try again.';
    });
});

function resetForm() {
    document.getElementById('aadhaar-form').reset();
    document.getElementById('otp-section').style.display = 'none';
    sessionStorage.removeItem('requestId');
}

function resetRightGrid() {
    const aadhaarInfoDiv = document.getElementById('aadhaar-info');
    aadhaarInfoDiv.innerHTML = ''; // Clear the right grid content
}
