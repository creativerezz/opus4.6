# shadcn/ui Recent Updates Summary

Based on the [shadcn/ui RSS feed](https://ui.shadcn.com/rss.xml), here are the latest features and updates:

## 🆕 Latest Features (2025-2026)

### January 2026
- **RTL Support** - CLI now supports right-to-left layouts by automatically converting physical CSS classes to logical equivalents
- **Inline Start and End Styles** - Base UI components updated to support inline-start and inline-end side values
- **Base UI Documentation** - Full documentation for Base UI components

### December 2025
- **`npx shadcn create`** - New command to customize everything: component library, icons, base color, theme, fonts and create your own version of shadcn/ui

### October 2025
- **New Components**: Spinner, Kbd, Button Group, Input Group, Field, Item, and Empty components
- **Registry Directory** - Browse and pull code/components from various registries

### August 2025
- **shadcn CLI 3.0** - Complete rewrite with:
  - Namespaced registries
  - Advanced authentication
  - New commands
  - Completely rewritten registry engine
- **MCP Server** - Zero-config MCP support for shadcn/ui registry

### February 2025
- **Tailwind v4 Support** - First preview of Tailwind v4 and React 19 support

### October 2024
- **React 19 Compatibility** - shadcn/ui is now compatible with React 19 and Next.js 15

## ✅ Your Current Setup

Based on your `components.json`:
- ✅ **RTL Support**: Enabled (`"rtl": true`)
- ✅ **Style**: `base-maia`
- ✅ **Icons**: Phosphor (`phosphor`)
- ✅ **TypeScript**: Enabled (`"tsx": true`)
- ✅ **React Server Components**: Enabled (`"rsc": true`)
- ✅ **Tailwind v4**: Using (based on your setup)
- ✅ **React 19**: Using (Next.js 16.1.4 includes React 19.2.3)

## 🚀 New Features You Can Use

### 1. Create Custom Project
```bash
npx shadcn create my-project
```
Customize component library, icons, colors, theme, and fonts.

### 2. Add New Components (October 2025)
```bash
npx shadcn add spinner
npx shadcn add kbd
npx shadcn add button-group
npx shadcn add input-group
npx shadcn add field
npx shadcn add item
npx shadcn add empty
```

### 3. Check for Updates
```bash
npx shadcn diff [component]
```
Check for updates against the registry.

### 4. Search Registries
```bash
npx shadcn search
npx shadcn list
```
Browse available components from registries.

## 📚 Key Resources

- **Official Site**: https://ui.shadcn.com
- **RSS Feed**: https://ui.shadcn.com/rss.xml
- **Changelog**: https://ui.shadcn.com/docs/changelog
- **CLI Version**: 3.7.0 (you have this)

## 🔄 Migration Notes

### If You Need to Update Components
```bash
# Check for updates
npx shadcn diff [component-name]

# Migrate to new radix-ui package (if needed)
npx shadcn migrate radix-ui
```

### Tailwind v4 Compatibility
Your setup is already using Tailwind v4, which is fully supported by shadcn/ui as of February 2025.

### React 19 Compatibility
You're using React 19.2.3, which is fully supported (since October 2024).

## 💡 Best Practices

1. **Use the latest CLI**: You have 3.7.0 ✅
2. **Enable RTL if needed**: Already enabled ✅
3. **Use Tailwind v4**: Already using ✅
4. **Check for component updates**: Use `npx shadcn diff`
5. **Explore registries**: Use `npx shadcn search` to find new components

---

**Last Updated**: January 2026
**Your CLI Version**: 3.7.0
**Status**: ✅ Up to date with latest features
