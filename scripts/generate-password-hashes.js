import bcrypt from "bcryptjs"

async function generateHashes() {
  const password = "admin123"

  console.log("Generating bcrypt hashes for password:", password)
  console.log("")

  for (let i = 0; i < 4; i++) {
    const hash = await bcrypt.hash(password, 10)
    console.log(`Hash ${i + 1}: ${hash}`)
  }

  console.log("")
  console.log("Use these hashes in your seed data script.")
}

generateHashes().catch(console.error)
