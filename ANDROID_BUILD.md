# Building Joplin APK for Android Tablet

This guide explains how to build a Joplin APK for your Android tablet using GitHub Actions.

## 🚀 Quick Start - Get Your APK Now!

### Automatic Build (Recommended) 
1. Go to the **Actions** tab in your GitHub repository
2. Click on **"Build APK for Personal Use"** workflow  
3. Click **"Run workflow"** button
4. Select the branch (usually `dev` or current branch)
5. Click **"Run workflow"**

### Download Your APK

1. Wait for the workflow to complete (usually 10-15 minutes)
2. Go to the **Actions** tab
3. Click on the completed workflow run
4. Scroll down to **Artifacts** section
5. Download **"joplin-tablet-apk"**
6. Extract the zip file to get `app-release.apk`

## Install on Your Tablet

1. Transfer the `app-release.apk` file to your Android tablet
2. Enable "Install from unknown sources" in your tablet's settings
3. Open the APK file and install Joplin

## Technical Details

- The APK is built with debug signing (no release keys needed)
- Only the release APK is built (optimized for size and performance)
- Build artifacts are kept for 30 days
- Compatible with Android tablets and phones

## Troubleshooting

If the build fails:
1. Check the workflow logs in the Actions tab
2. Ensure all dependencies are up to date
3. Try running the workflow again (sometimes transient issues occur)

## Workflows Available

- **`build-apk-for-release.yml`** - Simplified, tablet-focused build ⭐ **RECOMMENDED**
- **`simple-android-build.yml`** - Alternative simple build workflow
- **`build-android.yml`** - Full Android build (includes more comprehensive testing)

---

📚 **For detailed instructions, see [APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md)**