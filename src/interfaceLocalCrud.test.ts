import { CrudCalendar, Task } from "./interfaceLocalCrud";

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

const crudCalendar = new CrudCalendar();

describe("should righ work methods Crud", () => {
  const taskOne: Task = {
    date: new Date(2021, 5, 15),
    text: "read HTML book",
    status: "wait",
    tag: "low",
  };
  const taskTwo: Task = {
    date: new Date(2021, 8, 19),
    text: "practic JS",
    status: "process",
    tag: "middle",
  };
  it("CrudCalendar is a class", () => {
    expect(CrudCalendar).toBeInstanceOf(Function);
  });
  it("create method of crudCalendar", () => {
    expect(crudCalendar.create).toBeInstanceOf(Function);
  });
  it("localStorage have crudCal", async () => {
    expect(localStorage.getItem("crudCalendar")).toEqual(JSON.stringify([]));
  });
  it("create function is work", async () => {
    await crudCalendar.create(taskOne);
    await sleep(10);
    expect(localStorage.getItem("crudCalendar")).toEqual(
      JSON.stringify([taskOne])
    );
    await crudCalendar.create(taskTwo);
    await sleep(10);
    expect(localStorage.getItem("crudCalendar")).toEqual(
      JSON.stringify([taskOne, taskTwo])
    );
  });
  it("read function is work", async () => {
    const result = await crudCalendar.read(crudCalendar.tasks[0]);
    expect(result).toEqual(
      JSON.parse(localStorage.getItem("crudCalendar") as string)[0]
    );
  });
  it("update function is work", async () => {
    await crudCalendar.update(crudCalendar.tasks[0], { status: "process" });

    const resultTask = await crudCalendar.read(crudCalendar.tasks[0]);

    expect(resultTask.status).toBe("process");
  });
  it("delete function is work", async () => {
    const delTask = crudCalendar.tasks[0];
    await crudCalendar.delete(delTask);
    expect(localStorage.getItem("crudCalendar")).toEqual(
      JSON.stringify([taskTwo])
    );
  });
});
