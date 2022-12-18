import { ButtonWrapper, ButtonData } from "../../src/Paginations";

describe("ButtonWrapper: class that wrapps functionality of a button.", () => {
    test("should be able to store button's data.", () => {
        const data1:ButtonData = {customId: "example_id", style: "SUCCESS", label: "example_label"},
        data2:ButtonData = {customId: "example_id2", style: "DANGER", label: "example_label2", emoji: "❤"};

        const wrapper = new ButtonWrapper(data1);

        expect(wrapper.data).toStrictEqual(data1);
        expect(wrapper.toJSON()).toStrictEqual(data1);

        wrapper.setData(data2);

        expect(wrapper.data).toStrictEqual(data2);
        expect(wrapper.toJSON()).toStrictEqual(data2);
    });

    test("should be able to make builtComponent from button's data.", () => {
        const data1:ButtonData = {customId: "example_id", style: "SUCCESS", label: "example_label"},
        data2:ButtonData = {customId: "example_id2", style: "DANGER", label: "example_label2", emoji: "❤"};

        const discordData1 = {custom_id: "example_id", style: 3, type: 2, label: "example_label", emoji: null, disabled: false, url: null},
        discordData2 = {custom_id: "example_id2", style: 4, type: 2, label: "example_label2", disabled: false, url: null, emoji: {animated: false, id: null, name: data2.emoji}};

        const wrapper = new ButtonWrapper(data1);

        expect(wrapper.builtComponent.toJSON()).toStrictEqual(discordData1);

        wrapper.setData(data2);

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
        const wrapper1 = new ButtonWrapper({customId: "example_id", style: "PRIMARY", emoji: "❤"})
            .setAction(() => false)
            .setSwitch(() => false),

        wrapper2 = new ButtonWrapper(wrapper1),
        wrapper3 = new ButtonWrapper().setData(wrapper2);

        expect(wrapper2).toStrictEqual(wrapper1);
        expect(wrapper3).toStrictEqual(wrapper2);
    });
});