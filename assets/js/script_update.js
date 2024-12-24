document.getElementById("updateForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission
  
    const ehrName = document.getElementById("ehrName").value;
    const agencyName = document.getElementById("agencyName").value;
    const credentialType = document.getElementById("credentialType").value;
    console.log(credentialType)
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Basic validation
    if (!ehrName || !agencyName || !credentialType || !username || !password) {
      alert("All fields are required!");
      return;
    }
  
    try {
      // Step 1: Fetch the configuration data
      const response = await fetch(`https://da-web-app.azurewebsites.net/api/Config/GetConfigDataByName/${ehrName}`, {
        headers: {
          "X-SERVICE-KEY": "9A823946C424797374D357C436CEC",
        },
      });
  
      if (response.status !== 200) {
        alert("Enter a valid EHR name.");
        return;
      }
  
      const configData = await response.json();
  
      // Validate credentials key in the response
      if (!Array.isArray(configData.credentials)) {
        alert("Invalid data structure from the server.");
        console.error("Unexpected data:", configData);
        return;
      }
  
      // Step 2: Find and update the matching agency
      const matchingCredential = configData.credentials.find(
        (credential) => credential.credentialName === agencyName
      );
  
      if (!matchingCredential) {
        alert("Enter a valid agency name.");
        return;
      }
  
      // Update only the matched agency's credentials
      if (credentialType === "ehrCred") {
        matchingCredential.prodLoginUser = username;
        matchingCredential.prodLoginPassword = password;
      } else if (credentialType === "daCred") {
        matchingCredential.daProdLoginUser = username;
        matchingCredential.daProdLoginPassword = password;
      } else {
        alert("Invalid credential type selected.");
        return;
      }
  
      // Step 3: Send the entire updated configuration back
      const updateResponse = await fetch("https://da-web-app.azurewebsites.net/api/Config/UpdateConfigData", {
        method: "PUT",
        headers: {
          "X-SERVICE-KEY": "9A823946C424797374D357C436CEC",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData), // Send the full response
      });
  
      if (updateResponse.status === 200) {
        const updateResult = await updateResponse.text();
        if (updateResult === "Configuration Updated!") {
          alert("Credentials updated successfully!");
        } else {
          alert("Unexpected response: " + updateResult);
        }
      } else {
        alert("Unable to update credentials. Server error.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating credentials. Please try again.");
    }
  });
  