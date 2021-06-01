import { v4 as uuidv4 } from "uuid";

export type Task = {
  date: string;
  text: string;
  status: "wait" | "process" | "done";
  tag: "low" | "middle" | "high";
  id?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface ICrudCalendar {
  tasksId: Task["id"][] | string[];
  create(newTask: Task): Promise<Task[]>;
  read(id: Task["id"]): Promise<Task>;
  update(id: Task["id"], updateTask: Task): Promise<Task>;
  delete(id: Task["id"]): Promise<void>;
}

export namespace LocalStorage {
  export class CrudCalendar implements ICrudCalendar {
    tasksId: Task["id"][] = [];

    private storage: Task[] = [];

    private random: Task["id"];

    constructor() {
      if (localStorage.getItem("crudCalendar") !== undefined) {
        this.storage = [];
        localStorage.setItem("crudCalendar", JSON.stringify(this.storage));
      }
      this.random = "";
    }

    public async create(newTask: Task): Promise<Task[]> {
      this.storage.push(await this.createTask(newTask));
      this.tasksId.push(this.storage[this.storage.length - 1].id);
      localStorage.setItem("crudCalendar", JSON.stringify(this.storage));
      return this.storage;
    }

    public async read(id: Task["id"]): Promise<Task> {
      const result = [];
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].id === id) {
          result.push(this.storage[i]);
        }
      }
      return result[0];
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

      const storage = JSON.parse(
        localStorage.getItem("crudCalendar") as string
      );
      const newStorage = storage.map((item: Task) =>
        item.id === id ? newTask : item
      );
      localStorage.setItem("crudCalendar", JSON.stringify(newStorage));
      return newTask;
    }

    public async delete(id: Task["id"]): Promise<void> {
      const newStorage = this.storage.filter((item: Task) => item.id !== id);
      localStorage.setItem("crudCalendar", JSON.stringify(newStorage));
      const newTasks = this.tasksId.filter((item: Task["id"]) => item !== id);
      this.tasksId = newTasks;
    }

    public async createTask(task: Task): Promise<Task> {
      this.random = uuidv4();
      const newTask = task;
      newTask.id = this.random;
      return newTask;
    }

    public async filterDate(filtredDate: Date): Promise<Task[]> {
      return this.storage.filter(
        (item: Task) =>
          JSON.stringify(item.date) === JSON.stringify(filtredDate.toString())
      );
    }

    public async filterText(text: Task["text"]): Promise<Task[]> {
      return this.storage.filter((item: Task) => item.text === text);
    }

    public async filterTag(tag: Task["tag"]): Promise<Task[]> {
      return this.storage.filter((item: Task) => item.tag === tag);
    }

    public async filterStatus(status: Task["status"]): Promise<Task[]> {
      return this.storage.filter((item: Task) => item.status === status);
    }
  }
}
