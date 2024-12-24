document.getElementById("addAgencyForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission
  
    const ehrName = document.getElementById("ehrName").value;
    const agencyName = document.getElementById("agencyName").value; 
    const data_json = document.getElementById("configData").value; // JSON input
  
    // Basic validation
    if (!ehrName || !data_json || !agencyName) {
      alert("EHR Name and Config Data are required!");
      return;
    }
  
    try {
      // Step 1: Fetch the configuration data
      const response = await fetch(
        `https://da-web-app.azurewebsites.net/api/Config/GetConfigDataByName/${ehrName}`,
        {
          headers: {
            "X-SERVICE-KEY": "9A823946C424797374D357C436CEC",
          },
        }
      );
  
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
  
      // Step 2: Add the entered JSON to the end of the credentials array
      try {
        const newCredential = JSON.parse(data_json); // Parse the JSON input
        configData.credentials.push(newCredential); // Add the JSON directly
      } catch (parseError) {
        alert("Invalid JSON format. Please check your input.");
        console.error("JSON Parse Error:", parseError);
        return;
      }
  
      console.log("Updated Config Data:", configData); // Debugging
  
      // Step 3: Send the updated configuration back
      const updateResponse = await fetch(
        "https://da-web-app.azurewebsites.net/api/Config/UpdateConfigData",
        {
          method: "PUT",
          headers: {
            "X-SERVICE-KEY": "9A823946C424797374D357C436CEC",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(configData), // Send the updated response
        }
      );
  
      if (updateResponse.status === 200) {
        const updateResult = await updateResponse.text();
        if (updateResult === "Configuration Updated!") {
          alert("New configuration added successfully!");
        } else {
          alert("Unexpected response: " + updateResult);
        }
      } else {
        alert("Unable to update configuration. Server error.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating configuration. Please try again.");
    }
  });
  