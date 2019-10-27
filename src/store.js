const store = {
    currentOrder: [],
    items: [
        { name: "Weißwein", amount: 3.5, color: "#caf216" },
        { name: "Rotwein", amount: 3.5, color: "#750802", dark: true },
        { name: "Weinschorle", amount: 3, color: "#f5ffe0" },
        { name: "Cola", amount: 2.5, color: "#f22116" },
        { name: "Fanta", amount: 2.5, color: "#f2d516" },
        { name: "Sprite", amount: 2.5, color: "#07b558" },
        { name: "Wasser", amount: 2, color: "#52bdfa" },
        { name: "- Pfand 1x", amount: -1, color: "#d652fa" }
    ],
    user: null,
    concerts: [],
    selectedConcert: null,
}
export default store