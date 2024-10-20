const fs = require("fs");

// Function to parse transactions
function parseTransactions(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const lines = data.split("\n").map((line) => line.trim());
    const transactions = [];

    lines.forEach((line) => {
      // Use regex to capture the relevant parts
      const match = line.match(
        /(\d{1,2}[-\s]\w{3}[-\s]\d{4})\s+(.*?)(?:\s+(-?\d+(?:,\d{3})*(?:\.\d{2})?)\s+)?(\d+(?:,\d{3})*(?:\.\d{2})?)?\s+(\d+(?:,\d{3})*(?:\.\d{2})?)/
      );

      if (match) {
        const date = match[1]; // Capture the date
        const narration = match[2]
          .replace(/(CHQ|REF|NO)\s*:\s*\d+/gi, "")
          .trim(); // Clean narration

        // Extract debit and credit amounts
        const debitAmount = match[3]
          ? parseFloat(match[3].replace(/,/g, ""))
          : 0;
        const creditAmount = match[4]
          ? parseFloat(match[4].replace(/,/g, ""))
          : 0;

        let amount = 0;
        let type = "Unknown";

        if (debitAmount > 0) {
          amount = debitAmount;
          type = "Debited";
        } else if (creditAmount > 0) {
          amount = creditAmount;
          type = "Credited";
        }

        // Only push valid transactions
        if (date && narration) {
          transactions.push({
            Date: date,
            Narration: narration,
            Amount: amount,
            Type: type,
          });
        }
      }
    });

    return transactions;
  } catch (error) {
    console.error("Error in parseTransactions:", error.message);
    throw error;
  }
}

module.exports = parseTransactions;
