export type Task = {
  date: Date;
  text: string;
  status: "wait" | "process" | "done";
  tag: "low" | "middle" | "high";
  id?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface ICrudCalendar {
  tasks: Task["id"][];
  create(newTask: Task): Promise<Task[]>;
  read(id: Task["id"]): Promise<Task>;
  update(id: Task["id"], updateTask: Partial<Task>): Promise<Task>;
  delete(id: Task["id"]): Promise<void>;
}

export class CrudCalendar implements ICrudCalendar {
  tasks: Task["id"][] = [];

  constructor() {
    localStorage.setItem("crudCalendar", JSON.stringify([]));
  }

  public async create(newTask: Task): Promise<Task[]> {
    const storage = JSON.parse(localStorage.getItem("crudCalendar") as string);
    storage.push(await this.createTask(newTask));
    this.tasks.push(storage[storage.length - 1].id);
    localStorage.setItem("crudCalendar", JSON.stringify(storage));
    return storage;
  }

  // eslint-disable-next-line class-methods-use-this
  public async read(id: Task["id"]): Promise<Task> {
    const storage = JSON.parse(localStorage.getItem("crudCalendar") as any);
    return storage.find((item: Task) => item.id === id);
  }

  public async update(
    id: Task["id"],
    updateTask: Partial<Task>
  ): Promise<Task> {
    const newTask = await this.read(id);
    // eslint-disable-next-line no-restricted-syntax
    for (const key in newTask) {
      if (updateTask[key]) {
        newTask[key] = updateTask[key];
      }
    }

    const storage = JSON.parse(localStorage.getItem("crudCalendar") as string);
    const newStorage = storage.map((item: Task) =>
      item.id === id ? newTask : item
    );
    localStorage.setItem("crudCalendar", JSON.stringify(newStorage));
    return newTask;
  }

  // eslint-disable-next-line class-methods-use-this
  public async delete(id: Task["id"]): Promise<void> {
    const storage = JSON.parse(localStorage.getItem("crudCalendar") as string);
    const newStorage = storage.filter((item: Task) => item.id !== id);
    localStorage.setItem("crudCalendar", JSON.stringify(newStorage));
    const newTasks = this.tasks.filter((item: Task["id"]) => item !== id);
    this.tasks = newTasks;
  }

  // eslint-disable-next-line class-methods-use-this
  async createTask(task: Task): Promise<Task> {
    const random = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    const newTask = task;
    newTask.id = random;
    return newTask;
  }
}
