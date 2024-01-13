import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]>;

  activeLesson:Lesson;

  constructor(private coursesServices: CoursesService) {


  }

  ngOnInit() {


  }

  onSearch(search: string) {

    this.searchResults$ = this.coursesServices.searchLessons(search);

  }

  openLesson(lesson:Lesson){
     console.log(`opened lesson ${lesson.courseId}`);
     this.activeLesson = lesson;
  }

  backToSearch(){
    this.activeLesson = null;
  }

}











