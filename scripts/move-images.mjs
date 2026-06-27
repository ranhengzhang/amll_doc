#!/usr/bin/env node
/**
 * 扫描 docs/ 下的 markdown 文件，将相对路径的图片移动到 docs/public 并改写为 VitePress 绝对路径。
 *
 * 路径映射规则：
 *   markdown 文件: docs/<section>/<page>.md
 *   图片实际位置:  docs/<section>/<相对路径>/<图片名>  (相对于 markdown 文件)
 *   目标位置:      docs/public/<section>/img/<page>/<图片名>
 *   绝对 URL:      /<section>/img/<page>/<图片名>
 *
 * 支持的图片引用格式：
 *   1. ![alt](./relative/path.png)          标准 markdown 图片
 *   2. img-before="./relative/path.png"       Vue 组件属性
 *   3. img-after="./relative/path.png"        Vue 组件属性
 *   4. src="./relative/path.png"             Vue 组件属性
 *   5. src: './relative/path.png'            Vue 组件对象属性
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const docsDir = path.join(root, 'docs')
const publicDir = path.join(docsDir, 'public')

const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico']

/** 递归查找所有 markdown 文件（跳过 public 目录） */
function findMarkdownFiles(dir) {
  const results = []
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      if (path.resolve(fullPath) === path.resolve(publicDir)) continue
      results.push(...findMarkdownFiles(fullPath))
    } else if (item.isFile() && item.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

function isImagePath(p) {
  const ext = path.extname(p).toLowerCase()
  return imageExts.includes(ext)
}

function isRelativePath(p) {
  if (!p) return false
  if (p.startsWith('http://') || p.startsWith('https://')) return false
  if (p.startsWith('/')) return false
  return true
}

/**
 * 处理单张图片：若源文件存在则移动到 public，返回绝对 URL。
 * 若源文件不存在但目标已存在（已移动过），仅返回 URL 用于改写引用。
 */
function processImage(imgPath, mdDir, section, pageName) {
  const actualPath = path.resolve(mdDir, imgPath)
  const imageName = path.basename(imgPath)

  let destDir, absUrl
  if (section) {
    destDir = path.join(publicDir, section, 'img', pageName)
    absUrl = `/${section}/img/${pageName}/${imageName}`
  } else {
    destDir = path.join(publicDir, 'img', pageName)
    absUrl = `/img/${pageName}/${imageName}`
  }
  const destPath = path.join(destDir, imageName)

  const fileExists = fs.existsSync(actualPath)
  const destExists = fs.existsSync(destPath)

  if (fileExists) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    fs.copyFileSync(actualPath, destPath)
    fs.unlinkSync(actualPath)
    console.log(`  Moved: ${imgPath} -> ${absUrl}`)
    return { absUrl, moved: 1 }
  } else if (destExists) {
    console.log(`  Updated: ${imgPath} -> ${absUrl}`)
    return { absUrl, moved: 0 }
  } else {
    console.warn(`  Warning: Image not found: ${actualPath}`)
    return null
  }
}

function processMarkdown(mdFile) {
  let content = fs.readFileSync(mdFile, 'utf-8')
  let modified = false
  const mdDir = path.dirname(mdFile)
  const pageName = path.basename(mdFile, '.md')
  const section = path.relative(docsDir, mdDir).replace(/\\/g, '/')

  let movedCount = 0
  let updatedCount = 0

  // Pattern 1: Markdown image ![alt](path)
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
    if (!isImagePath(imgPath) || !isRelativePath(imgPath)) return match
    const result = processImage(imgPath, mdDir, section, pageName)
    if (!result) return match
    movedCount += result.moved
    updatedCount++
    modified = true
    return `![${alt}](${result.absUrl})`
  })

  // Pattern 2: Vue 组件属性 img-before="path" / img-after="path" / src="path"
  content = content.replace(/((?:img-before|img-after|src)\s*=\s*")([^"]+)"/g, (match, prefix, imgPath) => {
    if (!isImagePath(imgPath) || !isRelativePath(imgPath)) return match
    const result = processImage(imgPath, mdDir, section, pageName)
    if (!result) return match
    movedCount += result.moved
    updatedCount++
    modified = true
    return `${prefix}${result.absUrl}"`
  })

  // Pattern 3: Vue 组件对象属性 src: 'path'
  content = content.replace(/(src\s*:\s*')([^']+)'/g, (match, prefix, imgPath) => {
    if (!isImagePath(imgPath) || !isRelativePath(imgPath)) return match
    const result = processImage(imgPath, mdDir, section, pageName)
    if (!result) return match
    movedCount += result.moved
    updatedCount++
    modified = true
    return `${prefix}${result.absUrl}'`
  })

  if (modified) {
    fs.writeFileSync(mdFile, content, 'utf-8')
    console.log(`Updated: ${path.relative(root, mdFile)}`)
  }

  return { moved: movedCount, updated: updatedCount }
}

function main() {
  console.log('Scanning markdown files...\n')
  const mdFiles = findMarkdownFiles(docsDir)
  let totalMoved = 0
  let totalUpdated = 0

  for (const mdFile of mdFiles) {
    const result = processMarkdown(mdFile)
    totalMoved += result.moved
    totalUpdated += result.updated
  }

  console.log(`\nDone! Moved ${totalMoved} images, updated ${totalUpdated} references.`)
}

main()
