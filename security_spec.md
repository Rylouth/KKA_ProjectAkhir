# Security Specification for Quiz Snake Firestore

## 1. Data Invariants

1. **Immutability**: High scores are historical records. Once written, leaderboard entries are completely read-only. Updates and deletions are disallowed.
2. **Strict Schema Constraints**: Leaderboard entry payloads must contain exactly 6 fields: `name`, `score`, `correctAnswers`, `accuracy`, `difficulty`, `createdAt`.
3. **Data Type and Range Verification**:
   - `name`: Must be a string between 1 and 50 characters.
   - `score`: Must be an integer between 0 and 1,000,000.
   - `correctAnswers`: Must be an integer between 0 and 1,000.
   - `accuracy`: Must be a number between 0 and 100.
   - `difficulty`: Must be exactly "Mudah", "Sedang", or "Sulit".
   - `createdAt`: Must be an ISO timestamp string.

---

## 2. The "Dirty Dozen" Payloads (Agresssive Penetration Scenarios)

The following payload attempts must be strictly **REJECTED** by the security rules:

1. **Shadow Field Attack (Missing Key / Extraneous Field)**: Orphaning or injecting custom privileges.
   ```json
   {
     "name": "Hacker",
     "score": 100,
     "correctAnswers": 5,
     "accuracy": 80,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z",
     "isAdmin": true
   }
   ```
2. **Zero Length Name (Resource Poisoning)**: Empty string as database row.
   ```json
   {
     "name": "",
     "score": 100,
     "correctAnswers": 5,
     "accuracy": 80,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
3. **Huge String Name (Wallet Denial of Service)**: Attempting to submit 1MB text to exhaust user storage space.
   ```json
   {
     "name": "AveryLongNameRepeat... <10,000 chars>",
     "score": 100,
     "correctAnswers": 5,
     "accuracy": 80,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
4. **Invalid DataType to Numeric Fields**: Sending letters instead of integers.
   ```json
   {
     "name": "Budi",
     "score": "OneThousand",
     "correctAnswers": 5,
     "accuracy": 80,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
5. **Negative Score Attack**: Injecting a negative high score bounds.
   ```json
   {
     "name": "Budi",
     "score": -100,
     "correctAnswers": 5,
     "accuracy": 80,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
6. **Impossible High Score Attack (Excessive Limits)**: Submitting a score of 100 million.
   ```json
   {
     "name": "Budi",
     "score": 100000000,
     "correctAnswers": 5,
     "accuracy": 80,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
7. **Negative Answers Count**: Submitting negative trivia question ratios.
   ```json
   {
     "name": "Budi",
     "score": 500,
     "correctAnswers": -1,
     "accuracy": 80,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
8. **Invalid Accuracy Bound (Over-limit)**: Accuracy score greater than 100.
   ```json
   {
     "name": "Budi",
     "score": 500,
     "correctAnswers": 10,
     "accuracy": 150,
     "difficulty": "Sedang",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
9. **Option Value Poisoning (Invalid Difficulty Level)**: Sneaking values like "Sangat_Sulit" into the system enum.
   ```json
   {
     "name": "Budi",
     "score": 500,
     "correctAnswers": 10,
     "accuracy": 90,
     "difficulty": "HyperCore",
     "createdAt": "2026-06-11T08:19:54Z"
   }
   ```
10. **Malicious Date Spoofing (Too long/short)**: Writing an abnormally long date field to exploit index sizes.
    ```json
    {
      "name": "Budi",
      "score": 500,
      "correctAnswers": 10,
      "accuracy": 90,
      "difficulty": "Sedang",
      "createdAt": "A_Very_Long_Date_String_That_Is_Actually_A_Large_Script_Load_..."
    }
    ```
11. **Malicious Sibling Mutator (Update Attack)**: Modifying another player's registered score after it has been created.
12. **Malicious Sibling Destructor (Delete Attack)**: Removing higher ranking scores from the table.
