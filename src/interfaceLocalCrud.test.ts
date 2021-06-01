import { LocalStorage, Task } from "./interfaceLocalCrud";

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

const crudCalendar = new LocalStorage.CrudCalendar();

describe("should righ work methods Crud", () => {
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
  it("CrudCalendar is a class", () => {
    expect(LocalStorage.CrudCalendar).toBeInstanceOf(Function);
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
    const result = await crudCalendar.read(crudCalendar.tasksId[0]);
    expect(result).toEqual(
      JSON.parse(localStorage.getItem("crudCalendar") as string)[0]
    );
  });
  it("update function is work", async () => {
    await crudCalendar.update(crudCalendar.tasksId[0], { status: "process" });

    const resultTask = await crudCalendar.read(crudCalendar.tasksId[0]);

    expect(resultTask.status).toBe("process");
  });
  it("delete function is work", async () => {
    expect(
      JSON.parse(localStorage.getItem("crudCalendar") as string).length
    ).toEqual(2);
    const delTask = crudCalendar.tasksId[0];
    await crudCalendar.delete(delTask);
    expect(localStorage.getItem("crudCalendar")).toEqual(
      JSON.stringify([taskTwo])
    );
    expect(
      JSON.parse(localStorage.getItem("crudCalendar") as string).length
    ).toEqual(1);
  });
});

describe("filters is work", () => {
  it("filter by date", async () => {
    await sleep(10);
    const result = await crudCalendar.filterDate(new Date(2021, 8, 19));

    expect(result[0]).toEqual(
      JSON.parse(localStorage.getItem("crudCalendar") as string)[0]
    );
  });
  it("Must filter tasksId by text", async () => {
    const taskThree: Task = {
      date: new Date(2021, 8, 19).toString(),
      text: "Write CRUD bro!",
      status: "process",
      tag: "middle",
    };
    await crudCalendar.create(taskThree);
    const result = (await crudCalendar.filterText("Write CRUD bro!"))[0];

    expect(result).toEqual(
      JSON.parse(localStorage.getItem("crudCalendar") as string)[2]
    );
  });

  it("filter tag is work", async () => {
    const taskFour: Task = {
      date: new Date(2021, 8, 19).toString(),
      text: "necessary time to learn the React",
      status: "process",
      tag: "high",
    };

    await crudCalendar.create(taskFour);
    const result = await crudCalendar.filterTag("high");

    expect(result).toEqual([
      JSON.parse(localStorage.getItem("crudCalendar") as string)[3],
    ]);
  });

  it("filter 'status' is work", async () => {
    const result = await crudCalendar.filterStatus("process");
    console.log(localStorage.getItem("crudCalendar"));
    expect(result).toEqual([
      JSON.parse(localStorage.getItem("crudCalendar") as string)[0],
      JSON.parse(localStorage.getItem("crudCalendar") as string)[1],
      JSON.parse(localStorage.getItem("crudCalendar") as string)[2],
      JSON.parse(localStorage.getItem("crudCalendar") as string)[3],
    ]);
  });
});
