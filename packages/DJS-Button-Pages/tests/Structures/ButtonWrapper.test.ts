import { ButtonStyle, ComponentType } from "discord.js";
import { ButtonWrapper, ButtonData } from "../../src/Paginations";

describe("ButtonWrapper: class that wrapps functionality of a button.", () => {
    test("should be able to store button's data.", () => {
        const data1:ButtonData = {custom_id: "example_id", style: ButtonStyle.Success, label: "example_label"},
        data2:ButtonData = {custom_id: "example_id2", style: ButtonStyle.Danger, label: "example_label2", emoji: "❤"};

        const wrapper = new ButtonWrapper(data1);

        expect(wrapper.data).toStrictEqual(data1);
        expect(wrapper.toJSON()).toStrictEqual(data1);

        wrapper.setData(data2);

        expect(wrapper.data).toStrictEqual(data2);
        expect(wrapper.toJSON()).toStrictEqual(data2);
    });

    test("should be able to make builtComponent from button's data.", () => {
        const data1:ButtonData = {custom_id: "example_id", style: ButtonStyle.Success, label: "example_label"},
        data2:ButtonData = {custom_id: "example_id2", style: ButtonStyle.Danger, label: "example_label2", emoji: "❤"};

        const discordData1 = {...data1, type: ComponentType.Button, emoji: undefined},
        discordData2 = {...data2, type: ComponentType.Button, emoji: {animated: false, id: undefined, name: data2.emoji}};

        const wrapper = new ButtonWrapper(discordData1);

        expect(wrapper.builtComponent.data).toStrictEqual(discordData1);
        expect(wrapper.builtComponent.toJSON()).toStrictEqual(discordData1);

        wrapper.setData(data2);

        expect(wrapper.builtComponent.data).toStrictEqual(discordData2);
        expect(wrapper.builtComponent.toJSON()).toStrictEqual(discordData2);
    });

    test("should be able to store action function.", () => {
        const action = () => false;

        const wrapper = new ButtonWrapper()
            .setAction(action);

        expect(wrapper.action).toStrictEqual(action);
    });

    test("should be able to store switch function.", () => {
        const switchFunction = () => false;

        const wrapper = new ButtonWrapper()
            .setSwitch(switchFunction);

        expect(wrapper.switch).toStrictEqual(switchFunction);
    });

    test("should be able to re-create from another instance of class.", () => {
        const wrapper1 = new ButtonWrapper({custom_id: "example_id", style: ButtonStyle.Primary, emoji: "❤"})
            .setAction(() => false)
            .setSwitch(() => false),

        wrapper2 = new ButtonWrapper(wrapper1),
        wrapper3 = new ButtonWrapper().setData(wrapper2);

        expect(wrapper2).toStrictEqual(wrapper1);
        expect(wrapper3).toStrictEqual(wrapper2);
    });
});