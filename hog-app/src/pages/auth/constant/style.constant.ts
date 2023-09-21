import { CSSProperties } from "react";

export const style = {
    headerContainer: {
        display: "flex",
        alignSelf: "center",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
    } as CSSProperties,
    headerImage: {
        display: "flex",
        width: "40%",
        marginTop: 30,
        aspectRatio: "7.2 / 1",
    } as CSSProperties,

    contentContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        marginBottom: 40,
        alignSelf: "center",
        marginTop: 40,
    } as CSSProperties,

    footerContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "81%",
        alignSelf: "center",
        marginBottom: 150,
    } as CSSProperties,

    footerButton: {
        display: "flex",
        width: "40%",
        backgroundColor: "#0362D1",
        borderRadius: 10,
    } as CSSProperties,

    footerButtonText: {
        fontFamily: "Tuffy",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 3,
        color: "#000169",
    } as CSSProperties,
};
