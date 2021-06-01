import firebase from "firebase";
import { Task, ICrudCalendar } from "./interfaceLocalCrud";

const firebaseConfig = {
  apiKey: "AIzaSyD5JODdle4R0oJk-hq3DQRsQ3JXsdBbsB4",
  authDomain: "crudcalendar-9cbf3.firebaseapp.com",
  databaseURL:
    "https://crudcalendar-9cbf3-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "crudcalendar-9cbf3",
  storageBucket: "crudcalendar-9cbf3.appspot.com",
  messagingSenderId: "895109713115",
  appId: "1:895109713115:web:366e5bf0e894b767c850fe",
  measurementId: "G-GKYY2FX7L0",
};

firebase.initializeApp(firebaseConfig);

export namespace FireBaseCrud {
  export class CrudCalendar implements ICrudCalendar {
    tasksId: Task["id"][] = [];

    dataBase: firebase.database.Database;

    public fireBasePlace = "tasks";

    constructor(fireBasePlace?: string) {
      if (fireBasePlace === undefined) {
        this.fireBasePlace = "";
      }
      this.dataBase = firebase.database();
    }

    public async create(newTask: Task): Promise<Task[]> {
      const locacteFireBase = this.dataBase.ref(this.fireBasePlace);
      locacteFireBase.push(newTask);
      this.tasksId = Object.keys(await (await locacteFireBase.get()).val());
      const tasks: Task[] = Object.values(
        await (await locacteFireBase.get()).val()
      );
      return tasks;
    }

    public async read(id: string): Promise<Task> {
      const readTask: Task = await (
        await this.dataBase.ref(`${this.fireBasePlace}/${id}`).get()
      ).val();
      return readTask;
    }

    public async update(id: string, updateTask: Partial<Task>): Promise<Task> {
      const newTask = await this.read(id);

      // eslint-disable-next-line no-restricted-syntax
      for (const key in newTask) {
        if (updateTask[key]) {
          newTask[key] = updateTask[key];
        }
      }
      await this.dataBase.ref(`${this.fireBasePlace}/${id}`).set(newTask);
      return newTask;
    }

    public async delete(id: string): Promise<void> {
      await this.dataBase.ref(`${this.fireBasePlace}/${id}`).remove();
      this.tasksId = this.tasksId.filter((el) => el !== id);
    }
  }
}
