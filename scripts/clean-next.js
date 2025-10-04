import fs from 'fs'
import path from 'path'

// Resolve the .next directory safely relative to the current working dir
const projectRoot = path.resolve(process.cwd())
const dir = path.resolve(projectRoot, '.next')

function assertSafePath(targetPath) {
  // Ensure the target is inside the project root and is the .next directory
  if (!targetPath.startsWith(projectRoot)) {
    throw new Error(`Refusing to operate on path outside project root: ${targetPath}`)
  }
  if (path.basename(targetPath) !== '.next') {
    throw new Error(`Refusing to operate on unexpected target (not .next): ${targetPath}`)
  }
}

async function removeDir(retries = 3) {
  try {
    assertSafePath(dir)
    if (fs.existsSync(dir)) {
      await fs.promises.rm(dir, { recursive: true, force: true })
      console.log('.next removed')
    } else {
      console.log('.next does not exist')
    }
  } catch (err) {
    console.error('remove error', err)
    if (retries > 0) {
      console.log('retrying...')
      await new Promise((r) => setTimeout(r, 1000))
      return removeDir(retries - 1)
    }
    // Do not automatically exit the process; bubble the error code so callers can decide
    throw err
  }
}

// Run and report errors without force-quitting
removeDir().catch((err) => {
  console.error('clean-next failed:', err.message || err)
  process.exitCode = 1
})
