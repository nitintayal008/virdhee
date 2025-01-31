const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');

// Define the desired output headers
const csvWriter = createCsvWriter({
    path: 'organized_bank_statement.csv',
    header: [
        { id: 'date', title: 'Transaction Date' },
        { id: 'description', title: 'Description' },
        { id: 'type', title: 'Transaction Type' },
        { id: 'amount', title: 'Amount' },
        { id: 'balance', title: 'Balance' },
        { id: 'category', title: 'Category' }
    ]
});

const results = [];

// Helper function to clean currency values
function cleanAmount(amount) {
    if (typeof amount === 'string') {
        // Remove currency symbols, commas and convert to number
        return parseFloat(amount.replace(/[₹$,]/g, '').trim());
    }
    return amount;
}

// Helper function to categorize transactions
function categorizeTransaction(description) {
    description = description.toLowerCase();
    if (description.includes('salary') || description.includes('payroll')) {
        return 'Income';
    } else if (description.includes('atm') || description.includes('withdrawal')) {
        return 'Cash Withdrawal';
    } else if (description.includes('upi') || description.includes('gpay') || description.includes('phonepe')) {
        return 'UPI Payment';
    } else if (description.includes('neft') || description.includes('rtgs')) {
        return 'Bank Transfer';
    } else if (description.includes('bill') || description.includes('recharge')) {
        return 'Bill Payment';
    }
    return 'Others';
}

// Helper function to identify transaction type
function getTransactionType(amount, description) {
    if (amount > 0) {
        return 'Credit';
    }
    return 'Debit';
}

// Helper function to standardize date format
function standardizeDate(dateStr) {
    // Try different date formats
    const formats = ['DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY'];
    for (let format of formats) {
        const date = moment(dateStr, format, true);
        if (date.isValid()) {
            return date.format('YYYY-MM-DD');
        }
    }
    return dateStr; // Return original if no format matches
}

fs.createReadStream('bank_statement.csv')
    .pipe(csv())
    .on('data', (row) => {
        // Try to identify columns regardless of their original names
        const dateField = Object.keys(row).find(key => 
            key.toLowerCase().includes('date') || 
            key.toLowerCase().includes('time'));
        const descField = Object.keys(row).find(key => 
            key.toLowerCase().includes('desc') || 
            key.toLowerCase().includes('narration') || 
            key.toLowerCase().includes('particular'));
        const amountField = Object.keys(row).find(key => 
            key.toLowerCase().includes('amount') || 
            key.toLowerCase().includes('debit') || 
            key.toLowerCase().includes('credit'));
        const balanceField = Object.keys(row).find(key => 
            key.toLowerCase().includes('balance') || 
            key.toLowerCase().includes('closing'));

        // Clean and organize the data
        const amount = cleanAmount(row[amountField]);
        const description = row[descField]?.trim() || '';

        const cleanedRow = {
            date: standardizeDate(row[dateField]),
            description: description,
            type: getTransactionType(amount, description),
            amount: Math.abs(amount).toFixed(2),
            balance: cleanAmount(row[balanceField]).toFixed(2),
            category: categorizeTransaction(description)
        };

        results.push(cleanedRow);
    })
    .on('end', () => {
        // Sort transactions by date
        results.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

        // Write the organized data
        csvWriter.writeRecords(results)
            .then(() => {
                console.log('Bank statement has been organized successfully!');
                console.log(`Processed ${results.length} transactions.`);
            })
            .catch(err => {
                console.error('Error writing CSV:', err);
            });
    })
    .on('error', (error) => {
        console.error('Error processing CSV:', error);
    });