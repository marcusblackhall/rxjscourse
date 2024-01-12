import { Injectable } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";


@Injectable(
  {
    providedIn : 'root'
  }
)
export class CoursesStore {


  private subject = new BehaviorSubject<Course[]>([]);
  courses$ :Observable<Course[]> = this.subject.asObservable();
  constructor(

      private http:HttpClient,
      private loadingService:LoadingService,
      private messagesService:MessagesService

  ){
      this.loadAllCourses();
  }

  private loadAllCourses() {
     const loadCourses$ = this.http.get<Course[]>("/api/courses")
     .pipe(
        map(response => response['payload']),
        catchError( err => {
            const message = "Could not load courses";
            this.messagesService.showErrors(message);
            console.log(message,err);
            throw throwError(err);
        }),
        tap(courses => this.subject.next(courses))
        );

     this.loadingService.showUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId:string,changes:Partial<Course>) :Observable<any>{
    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id == courseId );

    const newCourse:Course = {
       ...courses[index],...changes
    }

    const newCourses :Course[] = courses.slice(0);
    newCourses[index] = newCourse;
      this.subject.next(newCourses);

     return this.http.put<Partial<Course>>(`/api/courses/${courseId}`,changes)
     .pipe(
      catchError(err => {
        const message = "Could not save course";
        console.log(message,err);
        this.messagesService.showErrors();
        return throwError(err);
      }),
      shareReplay());

  }


  filterByCategory(category:string ){

    return this.courses$.pipe(
          map(courses => courses.filter(course => course.category == category)
          .sort(sortCoursesBySeqNo)
          )
    );
  }


}
