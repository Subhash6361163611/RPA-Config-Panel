const API_BASE_URL = 'https://da-web-app.azurewebsites.net/api/Order';
const SERVICE_KEY = '9A823946C424797374D357C436CEC';

document.addEventListener('DOMContentLoaded', () => {
    const userRole = sessionStorage.getItem('userRole');
    if (!userRole) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('orderDetailsForm');
    const resultContainer = document.getElementById('resultContainer');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idType = document.getElementById('idType').value;
        const idValue = document.getElementById('idValue').value;

        try {
            const data = await fetchOrderDetails(idType, idValue);
            displayOrderDetails(data);
        } catch (error) {
            resultContainer.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        }
    });
});

async function fetchOrderDetails(idType, idValue) {
    const endpoint = idType === 'orderId' ? 'GetOrdersByNo' : 'GetOrdersByDocNo';
    const url = `${API_BASE_URL}/${endpoint}/${idValue}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'text/plain',
            'X-SERVICE-KEY': SERVICE_KEY,
            'Cookie': 'TiPMix=39.13362699601305; x-ms-routing-name=self'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch order details');
    }

    return response.json();
}

function displayOrderDetails(data) {
    const resultContainer = document.getElementById('resultContainer');
    
    const cardHTML = `
        <div class="card mt-4">
            <div class="card-body">
                <h3 class="card-title mb-4">Order Details</h3>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <strong>Order No:</strong> ${data.orderNo}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Order Date:</strong> ${data.orderDate}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Patient Name:</strong> ${data.patientName}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>MRN:</strong> ${data.mrn}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Document ID:</strong> ${data.documentID}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Document Name:</strong> ${data.documentName}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>EHR:</strong> ${data.ehr}
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Account:</strong> ${data.account}
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12">
                        <h5>Episode Details</h5>
                        <div class="d-flex justify-content-between">
                            <span><strong>Start Date:</strong> ${data.episodeStartDate}</span>
                            <span><strong>End Date:</strong> ${data.episodeEndDate}</span>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12">
                        <h5>Order Status</h5>
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Sent to Physician
                                <span class="badge ${data.sentToPhysicianStatus ? 'bg-success' : 'bg-danger'} rounded-pill">
                                    ${data.sentToPhysicianStatus ? 'Yes' : 'No'}
                                </span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Signed by Physician
                                <span class="badge ${data.signedByPhysicianStatus ? 'bg-success' : 'bg-danger'} rounded-pill">
                                    ${data.signedByPhysicianStatus ? 'Yes' : 'No'}
                                </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Uploaded Signed Order
                <span class="badge ${data.uploadedSignedOrderStatus ? 'bg-success' : 'bg-danger'} rounded-pill">
                    ${data.uploadedSignedOrderStatus ? 'Yes' : 'No'}
                </span>
            </li>
        </ul>
    </div>
</div>
${data.remarks ? `
<div class="row mt-3">
    <div class="col-md-12">
        <h5>Remarks</h5>
        <p>${data.remarks}</p>
    </div>
</div>
` : ''}
            </div>
        </div>
    `;

    resultContainer.innerHTML = cardHTML;
}

