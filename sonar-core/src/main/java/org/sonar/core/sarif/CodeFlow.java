/*
 * SonarQube
 * Copyright (C) 2009-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.core.sarif;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class CodeFlow {
  @SerializedName("threadFlows")
  private final List<ThreadFlow> threadFlows;

  private CodeFlow(List<ThreadFlow> threadFlows) {
    this.threadFlows = threadFlows;
  }

  public static CodeFlow of(List<ThreadFlow> threadFlows) {
    return new CodeFlow(threadFlows);
  }

  public List<ThreadFlow> getThreadFlows() {
    return threadFlows;
  }
}
