import * as PIXI from 'pixi.js';

export const fpsText = new PIXI.TextStyle(
    {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "black",
    }
);

export const rubTimesText = new PIXI.TextStyle(
    {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "#ff6593"
    }
);

export const scoreValueText = new PIXI.TextStyle(
    {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "#9f65ff"
    }
);

export const eliminationText = new PIXI.TextStyle(
    {
        fontFamily: "Arial",
        fontSize: 36,
        fill: "#3c79d5"
    }
);

export const moneyText = new PIXI.TextStyle(
    {
            fontFamily: "Arial",
            fontSize: 36,
            fill: "#d0b634"
    }
);

export const openText = new PIXI.TextStyle(
    {
        fontFamily: "Arial",
        fontSize: 72,
        fill: '#e8f0fd',
        stroke: '#000000',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        fontStyle: 'italic'
    }
);
