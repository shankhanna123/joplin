"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPicker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#800000', '#008080',
    '#C0C0C0', '#808080', '#404040', '#FFFFFF'
];
const ColorPicker = ({ selectedColor, onColorSelect }) => {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.label, children: "Brush Color:" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.colorGrid, children: colors.map((color) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [
                        styles.colorCircle,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColor
                    ], onPress: () => onColorSelect(color) }, color))) })] }));
};
exports.ColorPicker = ColorPicker;
const styles = react_native_1.StyleSheet.create({
    container: {
        marginTop: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        margin: 4,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    selectedColor: {
        borderColor: '#007AFF',
        borderWidth: 3,
    },
});
//# sourceMappingURL=ColorPicker.js.map