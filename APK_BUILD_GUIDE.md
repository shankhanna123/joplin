# 📱 Joplin Android APK Build Guide

Your Joplin repository is now configured to build APK files for your Android device!

## 🚀 Quick Start - Get Your APK Now!

### Method 1: Automatic Build (Recommended) ⭐

The easiest way is to use the GitHub Actions workflow that builds the APK automatically:

1. **Trigger the Build:**
   - Go to your repository: https://github.com/shankhanna123/joplin
   - Click the **"Actions"** tab
   - Click **"Build APK for Personal Use"** workflow
   - Click **"Run workflow"** button
   - Select branch: `copilot/fix-6944a03f-d6f7-4f71-8793-2df8ff519f2a` (current branch) or `dev`
   - Click **"Run workflow"**

2. **Download Your APK:**
   - Wait 10-15 minutes for the build to complete
   - Go back to the **Actions** tab
   - Click on the completed workflow run
   - Scroll down to **"Artifacts"** section
   - Download **"joplin-tablet-apk"**
   - Extract the ZIP file to get `app-release.apk`

### Method 2: Automatic Trigger (Even Easier!) 🎯

Since the workflow is configured to trigger on pushes, you can also:

1. Make any small change to trigger the build (e.g., edit README.md)
2. Commit and push to `dev` or `main` branch
3. The APK will be built automatically
4. Download from Actions tab as described above

## 📲 Install on Your Android Device

Once you have the `app-release.apk` file:

1. **Transfer APK to Device:**
   - Copy `app-release.apk` to your Android device
   - Via USB cable, cloud storage, or email

2. **Enable Unknown Sources:**
   - Go to Settings > Security (or Settings > Apps & notifications > Special app access)  
   - Enable "Install unknown apps" or "Unknown sources"
   - Allow installation from your file manager

3. **Install Joplin:**
   - Open the file manager on your Android device
   - Navigate to the APK file
   - Tap `app-release.apk`
   - Follow installation prompts
   - Joplin will be installed and ready to use!

## 🔧 Technical Details

- **Signing:** Uses debug signing (no release keys needed)
- **Target:** Android tablets and phones
- **Size:** Optimized release build (~20-30MB)
- **Compatibility:** Android 7.0+ (API level 24+)
- **Architecture:** Universal APK (works on all devices)

## 🛠️ Alternative: Local Build (Advanced)

If you prefer to build locally, use the provided script:

```bash
chmod +x build-apk.sh
./build-apk.sh
```

**Requirements for local build:**
- Java 17+ 
- Android SDK
- Node.js 18+
- 2GB+ free space

## 🆘 Troubleshooting

### Build Fails
1. Check workflow logs in Actions tab
2. Try running the workflow again (network issues are common)
3. Make sure you're using the correct branch

### Installation Fails
1. Make sure "Unknown sources" is enabled
2. Check available storage space (need 100MB+)
3. Try uninstalling any existing Joplin version first

### App Won't Start
1. Clear app data: Settings > Apps > Joplin > Storage > Clear Data
2. Restart device
3. Check device compatibility (Android 7.0+)

## 🎉 Success!

Once installed, you'll have a fully functional Joplin app on your Android device with:
- ✅ Note-taking and organization
- ✅ Markdown support
- ✅ File attachments
- ✅ Synchronization (configure in settings)
- ✅ Plugin support
- ✅ Dark/light themes

**Happy note-taking! 📝**

---

*Need help? Open an issue in this repository or check the [Joplin documentation](https://joplinapp.org/help/).*