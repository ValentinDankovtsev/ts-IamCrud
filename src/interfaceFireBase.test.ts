import firebase from "firebase";
import { FireBaseCrud } from "./interfaceFireBaseCrud";
import { Task } from "./interfaceLocalCrud";

const crudCalendar = new FireBaseCrud.CrudCalendar("newTasks");

beforeAll(async () => {
  await firebase.database().ref(crudCalendar.fireBasePlace).remove();
});

describe("firebase crud functions is work", () => {
  const taskOne: Task = {
    date: new Date(2021, 5, 15).toString(),
    text: "read HTML book",
    status: "wait",
    tag: "low",
  };
  const taskTwo: Task = {
    date: new Date(2021, 8, 19).toString(),
    text: "practic JS",
    status: "process",
    tag: "middle",
  };
  it("create function is work", async () => {
    const result = await crudCalendar.create(taskOne);
    expect(result).toEqual([taskOne]);
    const result2 = await crudCalendar.create(taskTwo);
    expect(result2).toEqual([taskOne, taskTwo]);
  });
  it("read is work", async () => {
    const result = await crudCalendar.read(crudCalendar.tasksId[1] as string);
    expect(result).toEqual(taskTwo);
  });
  it("update is work", async () => {
    await crudCalendar.update(crudCalendar.tasksId[1] as string, {
      status: "wait",
    });
    const resultTask = crudCalendar.read(crudCalendar.tasksId[1] as string);
    expect((await resultTask).status).toBe("wait");
  });

  it("delete is work", async () => {
    await crudCalendar.delete(crudCalendar.tasksId[1] as string);
    const locacteFireBase = crudCalendar.dataBase.ref(
      crudCalendar.fireBasePlace
    );
    const tasks: Task[] = Object.values(
      await (await locacteFireBase.get()).val()
    );
    expect(tasks).toEqual([taskOne]);
    expect(tasks.length).toEqual(1);
    expect(crudCalendar.tasksId).not.toBeNull();
  });
});
